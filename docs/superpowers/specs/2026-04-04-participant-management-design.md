# Participant Management Design

This document outlines the design for the Admin Participant Management system, allowing admins to bulk upload participants via CSV and manually manage them (Add, Edit, Delete) for specific events.

## 1. Overview
The system provides a centralized interface for admins to manage event attendees. It addresses the need for bulk data entry while maintaining the flexibility to handle individual corrections or additions.

## 2. Architecture & Data Flow
- **Frontend:** Next.js Server Components for data fetching and Client Components for interactive CSV parsing and filtering.
- **Backend:** Next.js Server Actions for database mutations.
- **Database:** Supabase `participants` table (linked to `events` via `event_id`).

## 3. Component Breakdown

### A. Event Selection Dashboard (`/admin/participants`)
- **Event Picker:** A searchable dropdown to select the target event.
- **Stats Overview:** Shows the current count of participants for the selected event.

### B. CSV Bulk Upload Tool
- **File Input:** Supports `.csv` file uploads.
- **Mapping Engine:** Automatically maps CSV columns (Name, Mobile, Area, Pincode, Address) to database fields.
- **Validation Preview:** Displays a table of parsed rows with "Valid" or "Error" status (e.g., missing mobile number) before final submission.
- **Bulk Insert Action:** Efficiently inserts all valid rows into Supabase in a single batch.

### C. Participant Management Table
- **Real-time Search:** Filter participants by name or mobile number.
- **Inline Editing:** Quick-edit mode for correcting typos in addresses or names.
- **Manual Add Form:** A slide-over or modal form for adding a single participant.
- **Delete Action:** Confirmation-protected deletion of individual records.

## 4. Implementation Details

### Database Schema (Existing)
```sql
CREATE TABLE public.participants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
    name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL, -- Will default to empty if not in CSV
    whatsapp_number text,
    area_name text NOT NULL,
    pincode text NOT NULL,
    full_address text,
    latitude double precision,
    longitude double precision,
    is_offering_ride boolean DEFAULT false,
    seats_available integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### New Server Actions (`app/admin/participants/actions.ts`)
- `uploadParticipants(eventId, participants)`: Batch insert.
- `updateParticipant(id, data)`: Update specific record.
- `deleteParticipant(id)`: Remove record.
- `addParticipant(data)`: Create single record.

## 5. Success Criteria
- Admin can select an event and upload 100+ participants via CSV in under 10 seconds.
- Admin can manually correct a participant's address without re-uploading the CSV.
- The system prevents duplicate uploads if the same file is processed twice (via simple name/phone check).

## 6. Testing Strategy
- **Unit Tests:** CSV parsing logic with various delimiters and quoted strings.
- **Integration Tests:** Supabase batch inserts and error handling for invalid UUIDs.
- **Manual Verification:** End-to-end flow from event creation to bulk participant upload.
