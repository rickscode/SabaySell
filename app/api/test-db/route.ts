import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createClient()

    // Test query to fetch listings
    const { data, error } = await supabase
      .from('listings')
      .select('id, title_en, price, status')
      .limit(5)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      listings: data,
      env_check: {
        has_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        has_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL
      }
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: String(err),
      message: 'Unexpected error'
    }, { status: 500 })
  }
}
