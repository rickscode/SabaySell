// =====================================================
// Sabay Sell Database Types
// Generated from Supabase schema
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// =====================================================
// ENUMS
// =====================================================

export type ListingType = 'fixed' | 'auction'
export type ListingStatus = 'draft' | 'active' | 'sold' | 'expired' | 'removed'
export type ListingCondition = 'new' | 'like_new' | 'used'
export type AuctionStatus = 'upcoming' | 'active' | 'ended' | 'cancelled'
export type BidStatus = 'active' | 'outbid' | 'won' | 'lost'
export type BoostType = 'featured' | 'top_category' | 'urgent' | 'highlight'
export type BoostStatus = 'pending_payment' | 'pending_verification' | 'active' | 'expired' | 'rejected'
export type TransactionType = 'boost_payment' | 'refund'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed'
export type ReportReason = 'spam' | 'inappropriate' | 'scam' | 'duplicate' | 'other'

// =====================================================
// DATABASE INTERFACE
// =====================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          telegram: string | null
          whatsapp: string | null
          rating: number
          total_ratings: number
          total_sales: number
          total_purchases: number
          is_banned: boolean
          banned_reason: string | null
          banned_until: string | null
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          telegram?: string | null
          whatsapp?: string | null
          rating?: number
          total_ratings?: number
          total_sales?: number
          total_purchases?: number
          is_banned?: boolean
          banned_reason?: string | null
          banned_until?: string | null
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          telegram?: string | null
          whatsapp?: string | null
          rating?: number
          total_ratings?: number
          total_sales?: number
          total_purchases?: number
          is_banned?: boolean
          banned_reason?: string | null
          banned_until?: string | null
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          user_id: string
          type: ListingType
          status: ListingStatus
          title_en: string | null
          title_km: string | null
          description_en: string | null
          description_km: string | null
          price: number | null
          currency: string
          category: string
          condition: ListingCondition | null
          location: string | null
          quantity: number
          views: number
          favorites: number
          is_negotiable: boolean
          shipping_free: boolean
          shipping_paid: boolean
          local_pickup: boolean
          shipping_cost: number
          created_at: string
          updated_at: string
          published_at: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type?: ListingType
          status?: ListingStatus
          title_en?: string | null
          title_km?: string | null
          description_en?: string | null
          description_km?: string | null
          price?: number | null
          currency?: string
          category: string
          condition?: ListingCondition | null
          location?: string | null
          quantity?: number
          views?: number
          favorites?: number
          is_negotiable?: boolean
          shipping_free?: boolean
          shipping_paid?: boolean
          local_pickup?: boolean
          shipping_cost?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: ListingType
          status?: ListingStatus
          title_en?: string | null
          title_km?: string | null
          description_en?: string | null
          description_km?: string | null
          price?: number | null
          currency?: string
          category?: string
          condition?: ListingCondition | null
          location?: string | null
          quantity?: number
          views?: number
          favorites?: number
          is_negotiable?: boolean
          shipping_free?: boolean
          shipping_paid?: boolean
          local_pickup?: boolean
          shipping_cost?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
          expires_at?: string | null
        }
      }
      images: {
        Row: {
          id: string
          listing_id: string
          storage_path: string
          url: string
          display_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          storage_path: string
          url: string
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          storage_path?: string
          url?: string
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      auctions: {
        Row: {
          id: string
          listing_id: string
          status: AuctionStatus
          start_price: number
          current_price: number | null
          min_increment: number
          reserve_price: number | null
          total_bids: number
          leading_bidder_id: string | null
          starts_at: string
          ends_at: string
          extended_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          status?: AuctionStatus
          start_price: number
          current_price?: number | null
          min_increment?: number
          reserve_price?: number | null
          total_bids?: number
          leading_bidder_id?: string | null
          starts_at: string
          ends_at: string
          extended_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          status?: AuctionStatus
          start_price?: number
          current_price?: number | null
          min_increment?: number
          reserve_price?: number | null
          total_bids?: number
          leading_bidder_id?: string | null
          starts_at?: string
          ends_at?: string
          extended_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      bids: {
        Row: {
          id: string
          auction_id: string
          user_id: string
          amount: number
          status: BidStatus
          is_autobid: boolean
          max_autobid_amount: number | null
          created_at: string
        }
        Insert: {
          id?: string
          auction_id: string
          user_id: string
          amount: number
          status?: BidStatus
          is_autobid?: boolean
          max_autobid_amount?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          auction_id?: string
          user_id?: string
          amount?: number
          status?: BidStatus
          is_autobid?: boolean
          max_autobid_amount?: number | null
          created_at?: string
        }
      }
      threads: {
        Row: {
          id: string
          listing_id: string
          buyer_id: string
          seller_id: string
          is_archived_by_buyer: boolean
          is_archived_by_seller: boolean
          is_blocked: boolean
          last_message_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          buyer_id: string
          seller_id: string
          is_archived_by_buyer?: boolean
          is_archived_by_seller?: boolean
          is_blocked?: boolean
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          buyer_id?: string
          seller_id?: string
          is_archived_by_buyer?: boolean
          is_archived_by_seller?: boolean
          is_blocked?: boolean
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          thread_id: string
          sender_id: string
          body: string
          is_read: boolean
          read_at: string | null
          attachment_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          sender_id: string
          body: string
          is_read?: boolean
          read_at?: string | null
          attachment_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          sender_id?: string
          body?: string
          is_read?: boolean
          read_at?: string | null
          attachment_url?: string | null
          created_at?: string
        }
      }
      boosts: {
        Row: {
          id: string
          listing_id: string
          user_id: string
          type: BoostType
          status: BoostStatus
          amount: number
          currency: string
          payment_reference: string | null
          payment_screenshot_url: string | null
          payment_provider: string
          transaction_id: string | null
          payment_email: string | null
          payment_hash: string | null
          bakong_qr_string: string | null
          starts_at: string | null
          ends_at: string | null
          duration_hours: number
          reviewed_by: string | null
          reviewed_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          user_id: string
          type: BoostType
          status?: BoostStatus
          amount: number
          currency?: string
          payment_reference?: string | null
          payment_screenshot_url?: string | null
          payment_provider?: string
          transaction_id?: string | null
          payment_email?: string | null
          payment_hash?: string | null
          bakong_qr_string?: string | null
          starts_at?: string | null
          ends_at?: string | null
          duration_hours: number
          reviewed_by?: string | null
          reviewed_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          user_id?: string
          type?: BoostType
          status?: BoostStatus
          amount?: number
          currency?: string
          payment_reference?: string | null
          payment_screenshot_url?: string | null
          payment_provider?: string
          transaction_id?: string | null
          payment_email?: string | null
          payment_hash?: string | null
          bakong_qr_string?: string | null
          starts_at?: string | null
          ends_at?: string | null
          duration_hours?: number
          reviewed_by?: string | null
          reviewed_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          boost_id: string | null
          type: TransactionType
          status: TransactionStatus
          amount: number
          currency: string
          provider: string | null
          external_reference: string | null
          notes: string | null
          processed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          boost_id?: string | null
          type: TransactionType
          status?: TransactionStatus
          amount: number
          currency?: string
          provider?: string | null
          external_reference?: string | null
          notes?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          boost_id?: string | null
          type?: TransactionType
          status?: TransactionStatus
          amount?: number
          currency?: string
          provider?: string | null
          external_reference?: string | null
          notes?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          target_listing_id: string | null
          target_user_id: string | null
          reason: ReportReason
          description: string | null
          status: ReportStatus
          reviewed_by: string | null
          reviewed_at: string | null
          resolution_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          target_listing_id?: string | null
          target_user_id?: string | null
          reason: ReportReason
          description?: string | null
          status?: ReportStatus
          reviewed_by?: string | null
          reviewed_at?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          target_listing_id?: string | null
          target_user_id?: string | null
          reason?: ReportReason
          description?: string | null
          status?: ReportStatus
          reviewed_by?: string | null
          reviewed_at?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_listing_views: {
        Args: {
          listing_id: string
        }
        Returns: void
      }
    }
    Enums: {
      listing_type: ListingType
      listing_status: ListingStatus
      listing_condition: ListingCondition
      auction_status: AuctionStatus
      bid_status: BidStatus
      boost_type: BoostType
      boost_status: BoostStatus
      transaction_type: TransactionType
      transaction_status: TransactionStatus
      report_status: ReportStatus
      report_reason: ReportReason
    }
  }
}

// =====================================================
// HELPER TYPES
// =====================================================

// Table row types
export type User = Database['public']['Tables']['users']['Row']
export type Listing = Database['public']['Tables']['listings']['Row']
export type Image = Database['public']['Tables']['images']['Row']
export type Auction = Database['public']['Tables']['auctions']['Row']
export type Bid = Database['public']['Tables']['bids']['Row']
export type Thread = Database['public']['Tables']['threads']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Boost = Database['public']['Tables']['boosts']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Report = Database['public']['Tables']['reports']['Row']

// Insert types
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type ListingInsert = Database['public']['Tables']['listings']['Insert']
export type ImageInsert = Database['public']['Tables']['images']['Insert']
export type AuctionInsert = Database['public']['Tables']['auctions']['Insert']
export type BidInsert = Database['public']['Tables']['bids']['Insert']
export type ThreadInsert = Database['public']['Tables']['threads']['Insert']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']
export type BoostInsert = Database['public']['Tables']['boosts']['Insert']
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
export type ReportInsert = Database['public']['Tables']['reports']['Insert']

// Update types
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type ListingUpdate = Database['public']['Tables']['listings']['Update']
export type ImageUpdate = Database['public']['Tables']['images']['Update']
export type AuctionUpdate = Database['public']['Tables']['auctions']['Update']
export type BidUpdate = Database['public']['Tables']['bids']['Update']
export type ThreadUpdate = Database['public']['Tables']['threads']['Update']
export type MessageUpdate = Database['public']['Tables']['messages']['Update']
export type BoostUpdate = Database['public']['Tables']['boosts']['Update']
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update']
export type ReportUpdate = Database['public']['Tables']['reports']['Update']

// Extended types with relations (for queries)
export type ListingWithImages = Listing & {
  images: Image[]
}

export type ListingWithUser = Listing & {
  user: User
}

export type ListingWithAuction = Listing & {
  auction: Auction | null
}

export type ListingFull = Listing & {
  user: User
  images: Image[]
  auction: Auction | null
}

export type ListingWithBoost = Listing & {
  images: Image[]
  user?: User
  active_boost?: {
    id: string
    type: BoostType
    ends_at: string
  } | null
}

export type AuctionWithBids = Auction & {
  bids: Bid[]
}

export type ThreadWithMessages = Thread & {
  messages: Message[]
  buyer: User
  seller: User
  listing: Listing
}

export type MessageWithSender = Message & {
  sender: User
}
