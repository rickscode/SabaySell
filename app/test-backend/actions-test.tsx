'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createListing, uploadImagesForListing, updateListing, deleteListing } from '@/app/actions/listings'
import { toast } from 'sonner'

export function ActionsTest() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [createdListingId, setCreatedListingId] = useState<string | null>(null)

  // Test form data
  const [formData, setFormData] = useState({
    title: 'Test Listing - MacBook Pro',
    description: 'This is a test listing created by the backend test page.',
    category: 'Electronics',
    location: 'Phnom Penh',
    price: '999.99'
  })

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  const addResult = (test: string, success: boolean, message: string, data?: any) => {
    setTestResults(prev => [...prev, { test, success, message, data, timestamp: new Date() }])
  }

  // Test 1: Create a listing (draft)
  const testCreateListing = async () => {
    setLoading(true)
    try {
      const result = await createListing({
        type: 'fixed',
        title_en: formData.title,
        description_en: formData.description,
        category: formData.category,
        location: formData.location,
        price: parseFloat(formData.price),
        status: 'draft',
        condition: 'new',
        is_negotiable: true
      })

      if (result.success && result.listingId) {
        setCreatedListingId(result.listingId)
        addResult('Create Listing', true, `Listing created successfully! ID: ${result.listingId}`, result)
        toast.success('Listing created!')
      } else {
        addResult('Create Listing', false, result.error || 'Unknown error', result)
        toast.error(result.error || 'Failed to create listing')
      }
    } catch (error: any) {
      addResult('Create Listing', false, error.message, error)
      toast.error('Unexpected error')
    }
    setLoading(false)
  }

  // Test 2: Upload images
  const testUploadImages = async () => {
    if (!createdListingId) {
      toast.error('Create a listing first!')
      return
    }

    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('Select files first!')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      Array.from(selectedFiles).forEach(file => {
        formData.append('images', file)
      })

      const result = await uploadImagesForListing(createdListingId, formData)

      if (result.success) {
        addResult('Upload Images', true, `Uploaded ${selectedFiles.length} image(s)`, result)
        toast.success('Images uploaded!')
      } else {
        addResult('Upload Images', false, result.error || 'Unknown error', result)
        toast.error(result.error || 'Failed to upload images')
      }
    } catch (error: any) {
      addResult('Upload Images', false, error.message, error)
      toast.error('Unexpected error')
    }
    setLoading(false)
  }

  // Test 3: Update listing
  const testUpdateListing = async () => {
    if (!createdListingId) {
      toast.error('Create a listing first!')
      return
    }

    setLoading(true)
    try {
      const result = await updateListing(createdListingId, {
        title_en: formData.title + ' (UPDATED)',
        price: parseFloat(formData.price) + 100
      })

      if (result.success) {
        addResult('Update Listing', true, 'Listing updated successfully', result)
        toast.success('Listing updated!')
      } else {
        addResult('Update Listing', false, result.error || 'Unknown error', result)
        toast.error(result.error || 'Failed to update listing')
      }
    } catch (error: any) {
      addResult('Update Listing', false, error.message, error)
      toast.error('Unexpected error')
    }
    setLoading(false)
  }

  // Test 4: Delete listing
  const testDeleteListing = async () => {
    if (!createdListingId) {
      toast.error('Create a listing first!')
      return
    }

    if (!confirm('Are you sure you want to delete the test listing?')) {
      return
    }

    setLoading(true)
    try {
      const result = await deleteListing(createdListingId)

      if (result.success) {
        addResult('Delete Listing', true, 'Listing deleted successfully', result)
        toast.success('Listing deleted!')
        setCreatedListingId(null)
      } else {
        addResult('Delete Listing', false, result.error || 'Unknown error', result)
        toast.error(result.error || 'Failed to delete listing')
      }
    } catch (error: any) {
      addResult('Delete Listing', false, error.message, error)
      toast.error('Unexpected error')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Test Form */}
      <Card>
        <CardHeader>
          <CardTitle>5. Server Actions Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Price (USD)</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Images (for upload test)</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedFiles(e.target.files)}
            />
            {selectedFiles && (
              <p className="text-sm text-gray-600">{selectedFiles.length} file(s) selected</p>
            )}
          </div>

          {createdListingId && (
            <div className="p-3 bg-green-50 rounded text-sm">
              <p className="text-green-700">Current Test Listing ID: <code className="font-mono">{createdListingId}</code></p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={testCreateListing} disabled={loading} variant="default">
              1. Create Listing
            </Button>
            <Button onClick={testUploadImages} disabled={loading || !createdListingId} variant="default">
              2. Upload Images
            </Button>
            <Button onClick={testUpdateListing} disabled={loading || !createdListingId} variant="default">
              3. Update Listing
            </Button>
            <Button onClick={testDeleteListing} disabled={loading || !createdListingId} variant="destructive">
              4. Delete Listing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testResults.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded text-sm ${
                    result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">
                      {result.success ? '✅' : '❌'} {result.test}
                    </span>
                    <span className="text-xs text-gray-500">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                    {result.message}
                  </p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-gray-600">View Details</summary>
                      <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={() => setTestResults([])}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Clear Results
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
