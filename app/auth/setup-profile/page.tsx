'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser, updateUserProfile, getUserProfile } from '@/lib/auth';

function SetupProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    display_name: '',
    location: '',
    bio: '',
    telegram: '',
    whatsapp: '',
  });

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        // Add a small delay to ensure session is fully loaded
        await new Promise(resolve => setTimeout(resolve, 200));

        if (!mounted) return;

        const { user } = await getCurrentUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        if (!mounted) return;
        setUserId(user.id);

        // Fetch existing profile data
        const { data: profile } = await getUserProfile(user.id);

        // If in edit mode or profile exists, pre-fill the form
        if (profile) {
          const prof = profile as any;
          setFormData({
            display_name: prof.display_name || '',
            location: prof.location || '',
            bio: prof.bio || '',
            telegram: prof.telegram || '',
            whatsapp: prof.whatsapp || '',
          });
        }

        // Only redirect if profile is complete AND not in edit mode
        const prof = profile as any;
        if (prof?.bio && prof?.location && prof?.telegram && prof?.whatsapp && !isEditMode) {
          router.push('/');
          return;
        }

        if (!mounted) return;
        setLoading(false);
      } catch (error) {
        console.error('Error in setup-profile checkAuth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSubmitting(true);
    setError(null);

    // Validate required fields
    if (!formData.display_name || formData.display_name.trim().length < 2) {
      setError('Display name must be at least 2 characters');
      setSubmitting(false);
      return;
    }

    if (!formData.telegram || formData.telegram.trim().length < 3) {
      setError('Telegram username or phone number is required');
      setSubmitting(false);
      return;
    }

    if (!formData.whatsapp || formData.whatsapp.trim().length < 8) {
      setError('WhatsApp number is required (minimum 8 digits)');
      setSubmitting(false);
      return;
    }

    const { error } = await updateUserProfile(userId, {
      display_name: formData.display_name.trim(),
      location: formData.location.trim() || null,
      bio: formData.bio.trim() || null,
      telegram: formData.telegram.trim(),
      whatsapp: formData.whatsapp.trim(),
    });

    if (error) {
      setError(error.message || 'Failed to update profile. Please try again.');
      setSubmitting(false);
      return;
    }

    router.push('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'កែសម្រួលប្រវត្តិរូប / Edit Profile' : 'រៀបចំប្រវត្តិរូប / Setup Your Profile'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Tell us a bit about yourself
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
              ឈ្មោះបង្ហាញ / Display Name <span className="text-red-500">*</span>
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              required
              value={formData.display_name}
              onChange={handleChange}
              placeholder="John Doe"
              maxLength={100}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={submitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              This is how other users will see you
            </p>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              ទីតាំង / Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="Phnom Penh"
              maxLength={100}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={submitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              Help buyers know where you're located
            </p>
          </div>

          <div>
            <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">
              Telegram <span className="text-red-500">*</span>
            </label>
            <input
              id="telegram"
              name="telegram"
              type="text"
              required
              value={formData.telegram}
              onChange={handleChange}
              placeholder="@username or phone number"
              maxLength={100}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={submitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter your Telegram username (@username) or phone number
            </p>
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              required
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="+855 12 345 678"
              maxLength={20}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={submitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              Required for communication and updates
            </p>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              អំពីខ្ញុំ / Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={submitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional: Share a bit about yourself or what you're selling
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || !formData.display_name || !formData.telegram || !formData.whatsapp}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : (isEditMode ? 'រក្សាទុកការផ្លាស់ប្តូរ / Save Changes' : 'បន្ត / Continue')}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500">
          You can update your profile anytime from settings
        </div>
      </div>
    </div>
  );
}

export default function SetupProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SetupProfileContent />
    </Suspense>
  );
}
