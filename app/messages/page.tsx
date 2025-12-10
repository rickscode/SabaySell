"use client";

import { useRouter } from "next/navigation";
import { MessagesInbox } from "@/components/messages-inbox";

export default function MessagesPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <MessagesInbox onBack={handleBack} />
  );
}
