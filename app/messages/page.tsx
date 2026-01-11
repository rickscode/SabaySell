import { redirect } from "next/navigation";
import { MessagesInbox } from "@/components/messages-inbox";
import { createServerClient } from "@/lib/supabase";
import { getUserThreads } from "@/lib/queries/messages";

export default async function MessagesPage() {
  // Get authenticated user
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Redirect if not authenticated
  if (!user || authError) {
    redirect('/auth/login');
  }

  // Fetch threads for this user
  const threads = await getUserThreads(user.id, supabase);

  return <MessagesInbox threads={threads} currentUserId={user.id} />;
}
