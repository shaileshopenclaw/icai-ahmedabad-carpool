# Participant Table Enhancement Design

This document outlines the design for improving the Admin Participant Management table, specifically focusing on data clarity, enhanced searchability, and CSV export capabilities.

## 1. Overview
The current participant table merges Area and Pincode into a single column and lacks data export functionality. This design proposes splitting the columns for better readability and adding a "Download CSV" feature to allow admins to export participant lists for offline use.

## 2. UI Changes

### A. Table Column Split
- **Before:** Single column "Area / Pincode" showing `Area (Pincode)`.
- **After:** Two distinct columns:
    - **Area:** Displays the locality name.
    - **Pincode:** Displays the 6-digit area code.
- **Reasoning:** Improves scannability and aligns with how admins think about geographic distribution.

### B. Action Bar Updates
- **New Button:** "Download CSV" button added to the header action area.
- **Icon:** `Download` icon from `lucide-react`.
- **Color:** Slate or Ghost style to distinguish from the "Primary" Add/Upload actions.

## 3. Functional Enhancements

### A. Multi-Field Search
- The existing search input will be updated to filter the participant list based on:
    - `name` (Partial match)
    - `phone` (Partial match)
    - `area_name` (Partial match)
    - `pincode` (Exact or partial match)
- **Logic:** `p.area_name.toLowerCase().includes(searchTerm.toLowerCase()) || p.pincode.includes(searchTerm)`

### B. CSV Export (Download)
- **Library:** Use `papaparse` (already installed) to convert the JSON state to CSV format.
- **Data Scope:** The export will target the **currently filtered** list of participants. If the admin has searched for a specific area, only those results will be exported.
- **Filename Format:** `participants-<event_title>-<date>.csv`

## 4. Implementation Plan (High Level)
1. Update the `filteredParticipants` constant in `ParticipantManager.tsx` to include Area and Pincode in the search logic.
2. Modify the table `thead` and `tbody` to render separate `<td>` elements for Area and Pincode.
3. Implement a `handleDownloadCSV` function using `Papa.unparse()`.
4. Add the Download button to the JSX and link it to the handler.

## 5. Success Criteria
- Admin can search for a specific Pincode and see only matching participants.
- Admin can click "Download CSV" and receive a file containing the visible list.
- Table remains responsive and readable on mobile/desktop.
