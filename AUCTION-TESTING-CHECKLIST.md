# Auction & Bidding System - Testing Checklist

## ✅ Phase 1 & 2 Complete

**Backend Implementation:**
- ✅ `lib/queries/auctions.ts` - All query functions created
- ✅ `app/actions/auctions.ts` - Bid placement server actions created
- ✅ `components/product-detail.tsx` - Bidding UI integrated

---

## 🧪 Test Scenarios

### 1. Auction Creation Tests

**Test 1.1: Create Auction Listing**
- [ ] Go to "Create Listing" page
- [ ] Select "Auction" listing type
- [ ] Fill in all required fields:
  - Title: "Test Auction Item"
  - Category: Any category
  - Condition: "New"
  - Location: "Phnom Penh"
  - Starting bid: $10.00
  - Duration: 7 days
  - Upload at least 1 image
  - Check "Free Shipping"
- [ ] Click "List Item"
- [ ] **Expected**: Listing created successfully
- [ ] **Expected**: Auction record created in `auctions` table
- [ ] **Expected**: Auction status = 'active', starts_at = now, ends_at = now + 7 days

**Test 1.2: Verify Auction Data**
- [ ] Check database via Rube MCP:
  ```sql
  SELECT * FROM auctions ORDER BY created_at DESC LIMIT 1;
  ```
- [ ] **Expected**: New auction with correct start_price, min_increment ($1.00), ends_at

---

### 2. Auction Display Tests

**Test 2.1: View Auction on Product Detail Page**
- [ ] Navigate to homepage
- [ ] Find the auction listing you just created
- [ ] Click on it to open product detail page
- [ ] **Expected**: Auction UI displays with:
  - Current bid: $10.00 (starting price)
  - "0 bids" text
  - Live countdown timer (should update every second)
  - Orange bidding card with input field
  - "Minimum bid: $11.00" text
  - "Place Bid" button
  - "Watch Auction" button
  - "Contact Seller" button

**Test 2.2: Countdown Timer**
- [ ] Watch the countdown timer for 5-10 seconds
- [ ] **Expected**: Timer updates every second
- [ ] **Expected**: Shows format "Xd Xh Xm" for days remaining OR "Xh Xm Xs" for hours remaining

**Test 2.3: Bid History Tab**
- [ ] Click on "Bid History" tab
- [ ] **Expected**: Tab shows "No bids yet" message
- [ ] **Expected**: Shows "Be the first to place a bid!" message

---

### 3. Bid Placement Tests

**Test 3.1: Place First Bid (Minimum Bid)**
- [ ] Log in as User A
- [ ] Go to auction product detail page
- [ ] Enter bid amount: $11.00 (minimum bid)
- [ ] Click "Place Bid"
- [ ] **Expected**: Toast notification: "Bid placed successfully"
- [ ] **Expected**: Page refreshes
- [ ] **Expected**: Current bid shows $11.00
- [ ] **Expected**: "1 bid" text displays
- [ ] **Expected**: Green badge: "You're the leading bidder!"

**Test 3.2: View Bid History After First Bid**
- [ ] Click "Bid History" tab
- [ ] **Expected**: Shows 1 bid entry
- [ ] **Expected**: Bid shows "You" as bidder name
- [ ] **Expected**: Bid amount: $11.00
- [ ] **Expected**: Green "Leading bid" badge
- [ ] **Expected**: Timestamp displays correctly

**Test 3.3: Place Higher Bid from Same User**
- [ ] While still logged in as User A
- [ ] Enter bid amount: $15.00
- [ ] Click "Place Bid"
- [ ] **Expected**: Bid placed successfully
- [ ] **Expected**: Current bid shows $15.00
- [ ] **Expected**: "2 bids" text
- [ ] **Expected**: Still shows "You're the leading bidder!"

**Test 3.4: Place Bid from Different User (Outbid Scenario)**
- [ ] Log out from User A
- [ ] Log in as User B
- [ ] Go to same auction
- [ ] **Expected**: Current bid shows $15.00
- [ ] **Expected**: Minimum bid shows $16.00
- [ ] **Expected**: NO "You're the leading bidder!" badge
- [ ] Enter bid: $20.00
- [ ] Click "Place Bid"
- [ ] **Expected**: Bid placed successfully
- [ ] **Expected**: Current bid: $20.00
- [ ] **Expected**: Badge: "You're the leading bidder!"
- [ ] **Expected**: Bid history shows User B at top

---

### 4. Bid Validation Tests

**Test 4.1: Bid Below Minimum**
- [ ] Enter bid: $5.00 (below current price)
- [ ] Click "Place Bid"
- [ ] **Expected**: Error toast: "Bid must be at least $21.00"
- [ ] **Expected**: Bid NOT placed

**Test 4.2: Bid Exactly at Current Price**
- [ ] Enter bid: $20.00 (current price, no increment)
- [ ] Click "Place Bid"
- [ ] **Expected**: Error toast: "Bid must be at least $21.00"

**Test 4.3: Empty Bid**
- [ ] Leave bid field empty
- [ ] Click "Place Bid"
- [ ] **Expected**: Error toast: "Please enter a bid amount"

**Test 4.4: Non-Numeric Bid**
- [ ] Enter: "abc"
- [ ] Click "Place Bid"
- [ ] **Expected**: Input validation prevents non-numeric entry OR error toast

**Test 4.5: Self-Bidding (Owner Bids on Own Auction)**
- [ ] Log in as original auction creator
- [ ] Go to your own auction
- [ ] Try to place a bid
- [ ] **Expected**: Error toast: "Cannot bid on your own auction"
- [ ] **Expected**: Bid NOT placed

---

### 5. Auction Status Tests

**Test 5.1: Active Auction**
- [ ] View any auction that hasn't ended
- [ ] **Expected**: Can place bids
- [ ] **Expected**: Countdown timer shows time remaining
- [ ] **Expected**: "Place Bid" button enabled

**Test 5.2: Ended Auction** (Manual Time Change)
- [ ] Use Rube MCP to manually set `ends_at` to past:
  ```sql
  UPDATE auctions
  SET ends_at = NOW() - INTERVAL '1 hour'
  WHERE id = 'AUCTION_ID';
  ```
- [ ] Refresh product detail page
- [ ] **Expected**: "Auction ended" message
- [ ] **Expected**: NO bidding UI shown
- [ ] **Expected**: If you were leading bidder: "Congratulations! You won this auction."
- [ ] **Expected**: Only "Contact Seller" button visible

**Test 5.3: Bid on Ended Auction**
- [ ] Try to place bid via API (if possible)
- [ ] **Expected**: Error: "Auction has ended"

---

### 6. Multi-User Bidding Flow

**Complete Scenario:**
1. [ ] User A creates auction: Starting bid $10
2. [ ] User B places first bid: $11 → Becomes leading bidder
3. [ ] User C places bid: $15 → Becomes leading bidder, User B's bid marked 'outbid'
4. [ ] User B places new bid: $20 → Becomes leading bidder again
5. [ ] User A (owner) tries to bid → ERROR
6. [ ] Check database:
   ```sql
   SELECT user_id, amount, status FROM bids WHERE auction_id = 'AUCTION_ID' ORDER BY created_at DESC;
   ```
7. [ ] **Expected**: 3 bids total
8. [ ] **Expected**: Latest bid (User B $20) has status = 'active'
9. [ ] **Expected**: Previous bids have status = 'outbid'

---

### 7. Edge Cases

**Test 7.1: Rapid Successive Bids**
- [ ] Place 3 bids very quickly (within 1 second)
- [ ] **Expected**: All bids process correctly
- [ ] **Expected**: Auction current_price updates each time
- [ ] **Expected**: Only latest bid marked 'active'

**Test 7.2: Auction Ending During Bid**
- [ ] Set auction to end in 5 seconds
- [ ] Wait until 1 second before end
- [ ] Try to place bid
- [ ] **Expected**: May succeed OR fail with "Auction has ended"

**Test 7.3: Very High Bid Amount**
- [ ] Enter bid: $999999.99
- [ ] **Expected**: Bid accepted (no maximum limit enforced)

**Test 7.4: Decimal Bid Amount**
- [ ] Enter bid: $25.50
- [ ] **Expected**: Bid accepted with exact amount

**Test 7.5: Negative Bid**
- [ ] Try to enter: -$10
- [ ] **Expected**: Input prevents negative number

---

### 8. Database Integrity Tests

**Test 8.1: Check Auction Table**
```sql
SELECT
  id,
  status,
  start_price,
  current_price,
  min_increment,
  total_bids,
  leading_bidder_id
FROM auctions
WHERE listing_id = 'LISTING_ID';
```
- [ ] **Expected**: current_price reflects latest bid
- [ ] **Expected**: total_bids increments correctly
- [ ] **Expected**: leading_bidder_id = latest bidder's user_id

**Test 8.2: Check Bids Table**
```sql
SELECT
  user_id,
  amount,
  status,
  created_at
FROM bids
WHERE auction_id = 'AUCTION_ID'
ORDER BY created_at DESC;
```
- [ ] **Expected**: All bids recorded
- [ ] **Expected**: Only latest bid has status = 'active'
- [ ] **Expected**: Previous bids have status = 'outbid'

---

### 9. UI/UX Tests

**Test 9.1: Responsive Design**
- [ ] View auction on mobile (< 640px width)
- [ ] **Expected**: Bidding UI stacks vertically
- [ ] **Expected**: All buttons accessible
- [ ] **Expected**: Bid input full width

**Test 9.2: Loading States**
- [ ] Click "Place Bid"
- [ ] Observe button during API call
- [ ] **Expected**: Button text changes to "Placing..."
- [ ] **Expected**: Button disabled during placement
- [ ] **Expected**: Re-enables after success/error

**Test 9.3: Toast Notifications**
- [ ] Place successful bid
- [ ] **Expected**: Green success toast appears
- [ ] Place invalid bid
- [ ] **Expected**: Red error toast appears

---

### 10. Integration Tests

**Test 10.1: Auction Card on Homepage**
- [ ] View homepage
- [ ] Find auction listing in grid
- [ ] **Expected**: Shows "Auction" badge (if implemented)
- [ ] **Expected**: Shows current bid count
- [ ] **Expected**: Shows countdown timer (if implemented)

**Test 10.2: My Listings Page**
- [ ] Go to "My Listings" as auction owner
- [ ] **Expected**: Shows your auction
- [ ] **Expected**: Displays current bid amount
- [ ] **Expected**: Shows total bids count

**Test 10.3: Search & Filter**
- [ ] Search for auction listing by title
- [ ] **Expected**: Auction appears in results
- [ ] Filter by category
- [ ] **Expected**: Auction shows if category matches

---

## 🐛 Known Limitations

1. **No Real-Time Updates**: Auction data requires page refresh to see new bids
2. **No Notifications**: Users don't get notified when outbid (requires Socket.IO)
3. **No Autobid**: No automatic bidding feature
4. **No Reserve Price Enforcement**: Reserve price stored but not validated
5. **No Auction Extension**: No "snipe prevention" (extending auction if bid placed in last minutes)

---

## ✅ Success Criteria

- [ ] All "Test Scenarios" pass
- [ ] No console errors during bidding
- [ ] Database stays in sync with UI
- [ ] Bid validation prevents invalid bids
- [ ] Multi-user bidding works correctly
- [ ] Countdown timer updates smoothly
- [ ] Bid history displays correctly

---

## 🚀 Next Steps (Future Enhancements)

1. **Real-Time Updates** - Socket.IO integration for live bid updates
2. **Push Notifications** - Notify users when outbid
3. **Email Notifications** - Email when auction ends
4. **Auto-Bid System** - Maximum bid with automatic increments
5. **Auction Analytics** - View count, bid activity graphs
6. **Reserve Price Logic** - Don't sell if reserve not met
7. **Auction Extension** - Add time if bid placed in last 5 minutes

---

**Last Updated**: November 25, 2025
**Phase**: Auction & Bidding System Implementation Complete
**Status**: Ready for Testing
