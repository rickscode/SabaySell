import { createServerClient } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { ActionsTest } from './actions-test'
import { Toaster } from '@/components/ui/sonner'

export default async function TestBackendPage() {
  const supabase = await createServerClient()
  const { user } = await getCurrentUser()

  // Test 1: Check database tables
  const tables = ['users', 'listings', 'images', 'auctions', 'bids', 'threads', 'messages', 'boosts', 'favorites', 'notifications']
  const tableTests: any[] = []

  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })

    tableTests.push({
      table,
      exists: !error,
      count: count || 0,
      error: error?.message
    })
  }

  // Test 2: Check storage bucket
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
  const listingImagesBucket = buckets?.find(b => b.name === 'listing-images')

  // Test 3: Check if user can query their own data
  let userListings = null
  let userListingsError = null
  if (user) {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', user.id)
      .limit(5)

    userListings = data
    userListingsError = error
  }

  // Test 4: Check RLS policies (should fail without auth for some tables)
  const { data: allListings, error: allListingsError } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">🧪 Backend Infrastructure Test</h1>

          {/* Authentication Status */}
          <div className="mb-6 p-4 bg-blue-50 rounded">
            <h2 className="font-semibold mb-2">Authentication Status</h2>
            {user ? (
              <div className="text-sm">
                <p className="text-green-600">✅ Authenticated</p>
                <p className="text-gray-600">User ID: {user.id}</p>
                <p className="text-gray-600">Email: {user.email}</p>
              </div>
            ) : (
              <p className="text-red-600">❌ Not authenticated - <a href="/auth/login" className="underline">Login</a></p>
            )}
          </div>

          {/* Database Tables */}
          <div className="mb-6">
            <h2 className="font-semibold mb-3">1. Database Tables</h2>
            <div className="space-y-2">
              {tableTests.map(test => (
                <div key={test.table} className="flex items-center justify-between p-3 bg-gray-50 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <span className={test.exists ? 'text-green-600' : 'text-red-600'}>
                      {test.exists ? '✅' : '❌'}
                    </span>
                    <span className="font-mono">{test.table}</span>
                  </div>
                  <div className="text-gray-600">
                    {test.exists ? (
                      <span>{test.count} rows</span>
                    ) : (
                      <span className="text-red-600">{test.error}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Bucket */}
          <div className="mb-6">
            <h2 className="font-semibold mb-3">2. Supabase Storage</h2>
            <div className="p-4 bg-gray-50 rounded">
              {listingImagesBucket ? (
                <div className="text-sm space-y-1">
                  <p className="text-green-600">✅ Bucket 'listing-images' exists</p>
                  <p className="text-gray-600">ID: {listingImagesBucket.id}</p>
                  <p className="text-gray-600">Public: {listingImagesBucket.public ? 'Yes' : 'No'}</p>
                  <p className="text-gray-600">File size limit: {listingImagesBucket.file_size_limit ? `${listingImagesBucket.file_size_limit / 1024 / 1024}MB` : 'Not set'}</p>
                </div>
              ) : (
                <p className="text-red-600">❌ Bucket 'listing-images' not found</p>
              )}
              {bucketsError && <p className="text-red-600 text-sm mt-2">Error: {bucketsError.message}</p>}
            </div>
          </div>

          {/* User Listings Query */}
          <div className="mb-6">
            <h2 className="font-semibold mb-3">3. User Listings Query (requires auth)</h2>
            <div className="p-4 bg-gray-50 rounded text-sm">
              {user ? (
                userListingsError ? (
                  <p className="text-red-600">❌ Error: {userListingsError.message}</p>
                ) : (
                  <div>
                    <p className="text-green-600">✅ Query successful</p>
                    <p className="text-gray-600 mt-2">Found {userListings?.length || 0} listings</p>
                    {userListings && userListings.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {userListings.map((listing: any) => (
                          <div key={listing.id} className="text-gray-600">
                            - {listing.title_en || listing.id}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ) : (
                <p className="text-yellow-600">⚠️ Not authenticated - cannot test user-specific queries</p>
              )}
            </div>
          </div>

          {/* Public Listings Query */}
          <div className="mb-6">
            <h2 className="font-semibold mb-3">4. Public Active Listings Query</h2>
            <div className="p-4 bg-gray-50 rounded text-sm">
              {allListingsError ? (
                <p className="text-red-600">❌ Error: {allListingsError.message}</p>
              ) : (
                <div>
                  <p className="text-green-600">✅ Query successful</p>
                  <p className="text-gray-600 mt-2">Found {allListings?.length || 0} active listings</p>
                  {allListings && allListings.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {allListings.map((listing: any) => (
                        <div key={listing.id} className="text-gray-600">
                          - {listing.title_en || listing.id} ({listing.status})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-2">Summary</h2>
            <div className="text-sm space-y-1">
              <p>✅ All 10 tables exist: {tableTests.filter(t => t.exists).length}/10</p>
              <p>✅ Storage bucket configured: {listingImagesBucket ? 'Yes' : 'No'}</p>
              <p>✅ Database queries working: {!allListingsError ? 'Yes' : 'No'}</p>
              {!user && <p className="text-yellow-600 mt-2">⚠️ Login to test authenticated features</p>}
            </div>
          </div>
        </div>

        {/* Server Actions Test (client component) */}
        {user ? (
          <ActionsTest />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-2">5. Server Actions Test</h2>
            <p className="text-yellow-600">⚠️ Please <a href="/auth/login" className="underline">login</a> to test server actions (create, update, delete listings)</p>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  )
}
