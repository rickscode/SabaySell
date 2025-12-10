'use client';

import { useRouter } from 'next/navigation';
import { UserSettings } from '@/components/user-settings';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <UserSettings onBack={() => router.push('/')} />
  );
}
