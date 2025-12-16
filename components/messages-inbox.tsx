"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  MessageCircle,
  Send,
  Search,
  ArrowLeft,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { ThreadWithDetails, MessageWithSender } from "@/lib/database.types";
import { sendMessage, markMessagesAsRead } from "@/app/actions/messages";
import { toast } from "sonner";
import { useSocket } from "@/lib/hooks/useSocket";

interface MessagesInboxProps {
  threads: ThreadWithDetails[];
  currentUserId: string;
}

export function MessagesInbox({ threads, currentUserId }: MessagesInboxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const threadParam = searchParams.get("thread");

  const [localThreads, setLocalThreads] = useState(threads);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(threadParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Sync selected thread with URL param
  useEffect(() => {
    if (threadParam) {
      setSelectedThreadId(threadParam);
    }
  }, [threadParam]);

  // Sync local threads when props change (e.g., on initial load or page refresh)
  useEffect(() => {
    setLocalThreads(threads);
  }, [threads]);

  // Get selected thread from local state
  const selectedThread = localThreads.find((t) => t.id === selectedThreadId) || null;

  // Filter threads by search
  const filteredThreads = localThreads.filter((thread) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const listing = thread.listing;

    return (
      listing.title_en?.toLowerCase().includes(query) ||
      listing.title_km?.toLowerCase().includes(query) ||
      thread.buyer.display_name?.toLowerCase().includes(query) ||
      thread.seller.display_name?.toLowerCase().includes(query)
    );
  });

  // Mark messages as read when thread is selected
  useEffect(() => {
    if (selectedThreadId) {
      markMessagesAsRead(selectedThreadId).catch((error) => {
        console.error("Error marking messages as read:", error);
      });
    }
  }, [selectedThreadId]);

  // Socket.IO real-time message subscription
  const socket = useSocket();

  useEffect(() => {
    if (!selectedThreadId || !socket) {
      console.log('🟢 SOCKET.IO: No selected thread or socket, skipping subscription');
      return;
    }

    console.log('🟢 SOCKET.IO: Joining thread:', selectedThreadId);
    socket.emit('thread:join', selectedThreadId);

    const handleNewMessage = (message: MessageWithSender) => {
      console.log('📨 SOCKET.IO: Received new message:', message);

      // Only update if message is from another user (avoid duplicates from own sends)
      if (message.sender_id !== currentUserId) {
        console.log('📨 SOCKET.IO: Message from other user, processing...');

        // Add message to local state
        setLocalThreads((prev) =>
          prev.map((thread) => {
            if (thread.id === selectedThreadId) {
              return {
                ...thread,
                messages: [...(thread.messages || []), message],
                last_message_at: message.created_at,
              };
            }
            return thread;
          })
        );

        // Show notification
        toast.success(`New message from ${message.sender.display_name}`);

        // Mark as read immediately since user is viewing this thread
        markMessagesAsRead(selectedThreadId);
      } else {
        console.log('📨 SOCKET.IO: Message from self, ignoring');
      }
    };

    socket.on('message:new', handleNewMessage);

    // Cleanup on unmount or thread change
    return () => {
      console.log('🔴 SOCKET.IO: Leaving thread:', selectedThreadId);
      socket.emit('thread:leave', selectedThreadId);
      socket.off('message:new', handleNewMessage);
    };
  }, [selectedThreadId, socket, currentUserId]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedThreadId || isSending) return;

    setIsSending(true);

    try {
      const result = await sendMessage(selectedThreadId, messageInput.trim());

      if (result.success && result.messageId) {
        // Create message object to add to UI
        const newMessage: any = {
          id: result.messageId,
          thread_id: selectedThreadId,
          sender_id: currentUserId,
          body: messageInput.trim(),
          created_at: new Date().toISOString(),
          is_read: false,
          read_at: null,
          attachment_url: null,
          sender: {
            id: currentUserId,
            display_name: selectedThread?.buyer_id === currentUserId
              ? selectedThread.buyer.display_name
              : selectedThread?.seller.display_name,
            avatar_url: selectedThread?.buyer_id === currentUserId
              ? selectedThread.buyer.avatar_url
              : selectedThread?.seller.avatar_url
          }
        };

        // Update local threads state
        setLocalThreads((prev) =>
          prev.map((thread) => {
            if (thread.id === selectedThreadId) {
              return {
                ...thread,
                messages: [...(thread.messages || []), newMessage],
                last_message_at: newMessage.created_at,
              };
            }
            return thread;
          })
        );

        setMessageInput("");
        toast.success("Message sent!");
        // NO router.push() or router.refresh() - state update handles it
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Unexpected error occurred");
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key to send
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get other party's name for display
  const getOtherPartyName = (thread: ThreadWithDetails): string => {
    return thread.buyer_id === currentUserId
      ? thread.seller.display_name || "Seller"
      : thread.buyer.display_name || "Buyer";
  };

  // Get other party's avatar for display
  const getOtherPartyAvatar = (thread: ThreadWithDetails): string | undefined => {
    return thread.buyer_id === currentUserId
      ? thread.seller.avatar_url || undefined
      : thread.buyer.avatar_url || undefined;
  };

  // Format timestamp
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Get last message text
  const getLastMessageText = (thread: ThreadWithDetails): string => {
    if (!thread.messages || thread.messages.length === 0) {
      return "No messages yet";
    }
    const lastMessage = thread.messages[thread.messages.length - 1];
    return lastMessage.body;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <Card className="h-[calc(100vh-2rem)] flex overflow-hidden">
          {/* Conversations List */}
          <div className="w-full md:w-96 border-r flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/")}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold flex-1">Messages</h2>
                <MessageCircle className="w-6 h-6 text-gray-600" />
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Conversations */}
            <ScrollArea className="flex-1">
              {filteredThreads.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {searchQuery ? "No conversations found" : "No messages yet"}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredThreads.map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => {
                        setSelectedThreadId(thread.id);
                        router.push(`/messages?thread=${thread.id}`, { scroll: false });
                      }}
                      className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                        selectedThreadId === thread.id ? "bg-gray-100" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0">
                          <ImageWithFallback
                            src={
                              thread.listing.images[0]?.url ||
                              "/placeholder.png"
                            }
                            alt={thread.listing.title_en || "Product"}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-medium truncate">
                              {thread.listing.title_en ||
                                thread.listing.title_km ||
                                "Product"}
                            </h3>
                            {thread.unread_count && thread.unread_count > 0 && (
                              <Badge variant="destructive" className="ml-2">
                                {thread.unread_count}
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 mb-1">
                            {getOtherPartyName(thread)} · $
                            {thread.listing.price.toFixed(2)}
                          </p>

                          <p className="text-sm text-gray-500 truncate">
                            {getLastMessageText(thread)}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {thread.last_message_at
                              ? formatTime(thread.last_message_at)
                              : ""}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Messages Panel */}
          <div className="hidden md:flex flex-1 flex-col overflow-hidden">
            {selectedThread ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden shrink-0">
                      {getOtherPartyAvatar(selectedThread) ? (
                        <ImageWithFallback
                          src={getOtherPartyAvatar(selectedThread)!}
                          alt={getOtherPartyName(selectedThread)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                          <span className="text-orange-600 font-semibold">
                            {getOtherPartyName(selectedThread)[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {getOtherPartyName(selectedThread)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedThread.listing.title_en ||
                          selectedThread.listing.title_km}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        ${selectedThread.listing.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {selectedThread.messages && selectedThread.messages.length > 0 ? (
                      selectedThread.messages.map((message: MessageWithSender) => {
                        const isOwnMessage = message.sender_id === currentUserId;

                        return (
                          <div
                            key={message.id}
                            className={`flex ${
                              isOwnMessage ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isOwnMessage
                                  ? "bg-[#fa6723] text-white"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{message.body}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isOwnMessage
                                    ? "text-orange-100"
                                    : "text-gray-500"
                                }`}
                              >
                                {formatTime(message.created_at)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        No messages yet. Start the conversation!
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t flex-shrink-0">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      rows={2}
                      className="resize-none"
                      disabled={isSending}
                    />
                    <Button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || isSending}
                      className="bg-[#fa6723] hover:bg-[#e55a1f] shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
