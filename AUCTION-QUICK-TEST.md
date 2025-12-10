# Auction System - Quick Test Plan

**Date**: November 25, 2025
**Server**: http://localhost:3000
**Status**: ✅ Build successful, ready for testing

---

## ⚡ Quick Test Flow (15 minutes)

### Prerequisites
- ✅ Dev server running on localhost:3000
- ✅ User logged in (Google OAuth)
- ✅ Have at least 1 image ready to upload

---

## Test 1: Create Auction Listing (5 min)

### Steps:
1. Click **"Start Selling"** button
2. Select **"Auction"** tab
3. Fill in form:
   - **Title**: "Test Auction - Nike Shoes"
   - **Category**: Fashion
   - **Condition**: New
   - **Location**: Phnom Penh
   - **Starting Bid**: $10.00
   - **Duration**: 7 days
   - **Upload Image**: Any product image
   - **Free Shipping**: Checked
4. Click **"List Item"**

### ✅ Expected Results:
- Toast: "Listing created successfully"
- Redirects to homepage
- New listing appears in grid
- Listing shows auction icon/badge (if implemented)

### 🐛 If Failed:
- Check browser console for errors
- Verify form validation passes
- Check image upload succeeded

---

## Test 2: View Auction Details (2 min)

### Steps:
1. Click on the auction listing you just created
2. Observe the product detail page

### ✅ Expected Results:
- **Current Bid**: Shows $10.00
- **Bid Count**: "0 bids"
- **Countdown Timer**: Live timer updating every second (shows days, hours, minutes)
- **Minimum Bid**: "Minimum bid: $11.00"
- **Bidding Card**: Orange card with $ input field
- **Buttons**: "Place Bid", "Watch Auction", "Contact Seller"
- **Tabs**: Details, Bid History, Seller Info

### 🐛 If Failed:
- Check if `auctionData` prop is being passed to ProductDetail component
- Verify auction record exists in database
- Check console for JavaScript errors

---

## Test 3: View Bid History (Empty State) (1 min)

### Steps:
1. Click **"Bid History"** tab

### ✅ Expected Results:
- Shows gavel icon
- Text: "No bids yet"
- Text: "Be the first to place a bid!"

---

## Test 4: Place Your First Bid (3 min)

### Steps:
1. Go back to **"Details"** tab
2. In the orange bidding card, enter **$11.00**
3. Click **"Place Bid"**
4. Wait for response

### ✅ Expected Results:
- ✅ Green toast: "Your bid of $11.00 has been placed successfully!"
- ✅ Page refreshes automatically
- ✅ Current bid updates to **$11.00**
- ✅ Bid count shows **"1 bid"**
- ✅ Green badge appears: **"You're the leading bidder!"**
- ✅ Minimum bid updates to **$12.00**

### 🐛 If Failed:
- Check browser console for errors
- Open Network tab, look for failed `/actions/auctions` request
- Verify user is authenticated
- Check database: `SELECT * FROM bids ORDER BY created_at DESC LIMIT 1;`

---

## Test 5: View Bid History (With Bids) (1 min)

### Steps:
1. Click **"Bid History"** tab

### ✅ Expected Results:
- Shows **1 bid entry**
- Bidder name: **"You"** (or your display name)
- Bid amount: **$11.00**
- Green badge: **"Leading bid"**
- Timestamp: Shows current date/time

---

## Test 6: Place Higher Bid (Same User) (2 min)

### Steps:
1. Go back to **"Details"** tab
2. Enter **$15.00** in bid field
3. Click **"Place Bid"**

### ✅ Expected Results:
- ✅ Toast: "Your bid of $15.00 has been placed successfully!"
- ✅ Current bid: **$15.00**
- ✅ Bid count: **"2 bids"**
- ✅ Still shows: **"You're the leading bidder!"**
- ✅ Minimum bid: **$16.00**

---

## Test 7: Bid Validation Tests (3 min)

### Test 7.1: Bid Below Minimum
**Steps**: Enter $14.00, click "Place Bid"
**Expected**: 🔴 Red toast: "Minimum bid is $16.00"

### Test 7.2: Empty Bid
**Steps**: Leave field empty, click "Place Bid"
**Expected**: 🔴 Red toast: "Please enter a bid amount"

### Test 7.3: Non-Numeric Bid
**Steps**: Enter "abc", click "Place Bid"
**Expected**: 🔴 Red toast: "Please enter a bid amount" (or input prevents letters)

### Test 7.4: Negative Bid
**Steps**: Try to enter -$10
**Expected**: Input field prevents negative numbers

---

## Test 8: Owner Cannot Bid (Multi-User Test)

**NOTE**: This requires opening an incognito window or using a different browser to log in as a different user.

### Steps:
1. Stay logged in as the auction creator
2. Try to place a bid on your own auction
3. Enter $20.00
4. Click "Place Bid"

### ✅ Expected Results:
- 🔴 Red toast: **"Cannot bid on your own auction"**
- Bid is NOT placed
- Current bid remains $15.00

**Alternative Test** (if you don't have a second account):
- Check the code enforces this rule (it does - `app/actions/auctions.ts` line 61-63)

---

## Test 9: Database Verification (2 min)

Use Rube MCP to check database state:

### Query 1: Check Auction Record
```sql
SELECT
  id,
  status,
  start_price,
  current_price,
  min_increment,
  total_bids,
  ends_at
FROM auctions
WHERE listing_id = 'YOUR_LISTING_ID'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected**:
- `status`: 'active'
- `start_price`: 10.00
- `current_price`: 15.00
- `min_increment`: 1.00
- `total_bids`: 2
- `ends_at`: ~7 days from now

### Query 2: Check Bids
```sql
SELECT
  user_id,
  amount,
  status,
  created_at
FROM bids
WHERE auction_id = 'YOUR_AUCTION_ID'
ORDER BY created_at DESC;
```

**Expected**:
- 2 bids total
- Latest bid ($15.00) has `status = 'active'`
- Earlier bid ($11.00) has `status = 'outbid'`

---

## 🎯 Success Criteria

### Core Functionality ✅
- [ ] Auction listing created successfully
- [ ] Auction displays on product detail page
- [ ] Countdown timer works (updates every second)
- [ ] Can place bids successfully
- [ ] Current price updates after each bid
- [ ] Bid history displays correctly
- [ ] Leading bidder badge shows for your bids

### Validation ✅
- [ ] Cannot bid below minimum
- [ ] Cannot bid with empty/invalid input
- [ ] Owner cannot bid on own auction
- [ ] Toast notifications work for success/error

### Database Integrity ✅
- [ ] Auction record created correctly
- [ ] Bids recorded in database
- [ ] Previous bids marked 'outbid'
- [ ] Only latest bid is 'active'

---

## 🐛 Known Limitations (Not Tested Yet)

1. **No Real-Time Updates** - Must refresh page to see new bids from other users
2. **No Outbid Notifications** - Users don't get notified when outbid
3. **No Auction End Handling** - What happens when auction ends needs testing
4. **No Reserve Price** - Reserve price column exists but not enforced
5. **Multi-User Bidding** - Needs 2+ users to test fully

---

## 🚀 Next Steps After Testing

If all tests pass:
1. ✅ Mark auction system as **COMPLETE**
2. Test with 2 users (multi-user bidding flow)
3. Test auction ending (manually set `ends_at` to past)
4. Move on to **Messaging System** implementation

If tests fail:
1. Document which test failed
2. Check browser console errors
3. Check server logs (dev server output)
4. Debug and fix issues

---

## 📸 Screenshots to Capture

During testing, capture screenshots of:
1. ✅ Auction creation form (filled out)
2. ✅ Product detail page (auction UI with countdown)
3. ✅ Success toast after placing bid
4. ✅ "You're the leading bidder!" badge
5. ✅ Bid history tab (with bids)
6. ✅ Error toast (bid below minimum)

---

**Last Updated**: November 25, 2025
**Estimated Time**: 15-20 minutes for full test flow
**Status**: Ready for testing
