'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { UserProfile } from '@/components/user-profile';
import { Product } from '@/components/product-card';

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);

        // Get current user
        const { user: currentUser } = await getCurrentUser();
        setCurrentUserId(currentUser?.id || null);

        // Fetch user by username
        const supabase = createClient();
        const { data: userData, error } = await supabase
          .from('users')
          .select('id')
          .eq('username', username)
          .maybeSingle();

        if (error || !userData) {
          console.error('User not found:', error);
          setNotFound(true);
          setLoading(false);
          return;
        }

        setUserId((userData as any).id);
        setLoading(false);
      } catch (error) {
        console.error('Error loading user:', error);
        setNotFound(true);
        setLoading(false);
      }
    }

    if (username) {
      loadUser();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fa6723] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
          <p className="text-gray-600 mb-4">The user @{username} doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Go back to homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <UserProfile
      userId={userId!}
      isOwnProfile={userId === currentUserId}
      onBack={() => router.push('/')}
      onSettings={() => router.push('/settings')}
      onEditProfile={() => router.push('/settings')}
      onProductClick={(product: Product) => {
        router.push(`/listings/${product.id}`);
      }}
    />
  );
}
