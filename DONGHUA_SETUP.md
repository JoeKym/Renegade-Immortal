# Donghua Real-Time Progress Setup Guide

This guide explains how to set up the real-time donghua progress tracking system.

## Overview

The real-time donghua system allows you to:
- Display current episode count dynamically across the site
- Track adaptation progress (chapters covered)
- Manage story arc statuses (completed, now airing, upcoming)
- Update all donghua-related data from the Admin Dashboard

## Database Setup

### Step 1: Run the Migration

Execute the SQL migration file in your Supabase SQL Editor:

```sql
-- File: supabase/migrations/20240120_donghua_tracking.sql
-- This creates the necessary tables and seed data
```

### Step 2: Tables Created

1. **donghua_arcs** - Stores story arc information
   - id, name, description
   - episode_start, episode_end
   - chapter_start, chapter_end
   - status (completed, now_airing, upcoming)
   - order_index

2. **donghua_progress** - Global progress tracking (single row)
   - current_episode, total_episodes
   - current_chapter, total_chapters
   - last_updated

3. **donghua_episodes** - Detailed episode tracking
   - episode_number, chapter_start, chapter_end
   - air_date, status

### Step 3: Seed Data

The migration automatically inserts:
- 6 story arcs with correct episode/chapter ranges
- Initial progress: 128 episodes, 850 chapters

## Admin Dashboard Access

### Step 4: Access the Donghua Tab

1. Login as an admin user
2. Navigate to the Admin Dashboard (`/admin`)
3. Click on the **"Donghua"** tab (with TV icon)
4. You'll see three sections:
   - **Update Progress**: Edit episode/chapter counts
   - **Current Stats**: Visual display of progress
   - **Story Arc Status**: Toggle arc statuses

### Step 5: Update Progress

To update donghua progress:
1. Enter new values in the form fields:
   - Current Episode (e.g., 129 when new episode releases)
   - Total Episodes (estimated total)
   - Current Chapter (chapters covered)
   - Total Chapters (2100 total in novel)
2. Click "Update Progress"
3. Changes reflect immediately across the site

### Step 6: Manage Arc Statuses

To change a story arc status:
1. Find the arc in the "Story Arc Status" list
2. Select new status from dropdown:
   - `upcoming` - Not yet started
   - `now_airing` - Currently airing
   - `completed` - Finished airing
3. Status updates immediately on Donghua page

## Pages Affected

The following pages now show real-time data:

1. **Donghua Page** (`/donghua`)
   - Episodes Aired counter
   - Chapters Adapted counter
   - Story Arc statuses
   - Progress bars

2. **Guide Page** (`/guide`)
   - Episode count in donghua section

3. **About Page** (`/about`)
   - Episodes Covered stat
   - Chapters Adapted stat

## API Functions

Available in `src/services/donghua.ts`:

```typescript
// Fetch data
getDonghuaStats()          // Get simplified stats
getDonghuaArcs()           // Get all story arcs
getDonghuaProgress()       // Get full progress data
getEpisodeBreakdown()      // Get episode details

// Admin operations
updateDonghuaProgress()    // Update progress numbers
updateArcStatus()          // Change arc status
addEpisode()               // Add new episode record
```

## Default Data

### Story Arcs
1. **Ji Realm Awakening** (Ep 1-50, Ch 1-250) - Completed
2. **Underworld & Corporeal Realm** (Ep 51-100, Ch 251-600) - Completed
3. **Ancient God Lands** (Ep 101-150, Ch 601-1000) - Now Airing
4. **Dao Expansion & Alliances** (Ep 151-200, Ch 1001-1400) - Upcoming
5. **Heaven-Defying Ascension** (Ep 201-250, Ch 1401-1800) - Upcoming
6. **Final Confrontation** (Ep 251-350, Ch 1801-2100) - Upcoming

### Progress
- Current Episode: 128
- Total Episodes: 350
- Current Chapter: 850
- Total Chapters: 2100

## Troubleshooting

### Data not updating on frontend?
1. Check browser console for errors
2. Verify Supabase connection
3. Confirm RLS policies are set correctly
4. Try hard refresh (Ctrl+Shift+R)

### Admin tab not visible?
1. Ensure you have admin role in `user_roles` table
2. Check that you're logged in
3. Verify component imports

### Migration failed?
1. Check if tables already exist
2. Run `DROP TABLE` statements if needed (careful!)
3. Re-run migration

## Security

- **Public**: Can read all donghua data
- **Authenticated Admins**: Can update progress and arc statuses
- Row Level Security (RLS) policies enforce these rules

## Future Enhancements

Potential improvements:
- Episode air date tracking with countdown
- Automatic status updates based on dates
- Episode release notifications
- Historical progress charts
- User "mark as watched" tracking
