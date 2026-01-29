import { auth, currentUser } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Use service role client for creating profiles (bypasses RLS)
function getServiceClient() {
  const url = process.env.NEXT_SUPABASE_URL
  const key = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(url, key)
}

export async function POST() {
  try {
    console.log('[v0] Profile ensure API called')
    
    const { userId } = await auth()
    
    console.log('[v0] Auth check - userId:', userId ? 'present' : 'missing')
    
    if (!userId) {
      console.error('[v0] No userId found - check NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await currentUser()
    const supabase = getServiceClient()

    console.log('[v0] Checking for existing profile...')

    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("athlete_profiles")
      .select("id")
      .eq("clerk_user_id", userId)
      .maybeSingle()

    if (fetchError) {
      console.error("[v0] Error checking profile:", fetchError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // If profile exists, return success immediately
    if (existingProfile) {
      console.log('[v0] Profile already exists:', existingProfile.id)
      return NextResponse.json({ 
        success: true, 
        message: "Profile exists",
        profileId: existingProfile.id,
        created: false
      })
    }

    console.log('[v0] Creating new profile...')

    // Create new profile with info from Clerk
    const { data: newProfile, error: insertError } = await supabase
      .from("athlete_profiles")
      .insert({
        clerk_user_id: userId,
        firstname: user?.firstName || null,
        lastname: user?.lastName || null,
        username: user?.username || null,
        email: user?.emailAddresses[0]?.emailAddress || null,
        onboarding_completed: false,
      })
      .select("id")
      .single()

    if (insertError) {
      // Handle race condition where profile was just created
      if (insertError.code === '23505') {
        console.log('[v0] Profile created by concurrent request')
        const { data: existingProfile2 } = await supabase
          .from("athlete_profiles")
          .select("id")
          .eq("clerk_user_id", userId)
          .single()
        
        return NextResponse.json({ 
          success: true, 
          message: "Profile exists",
          profileId: existingProfile2?.id,
          created: false
        })
      }
      
      console.error("[v0] Error creating profile:", insertError)
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
    }

    console.log('[v0] Profile created successfully:', newProfile.id)

    return NextResponse.json({ 
      success: true, 
      message: "Profile created",
      profileId: newProfile.id,
      created: true
    })

  } catch (error) {
    console.error("[v0] Unexpected error in profile ensure:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}