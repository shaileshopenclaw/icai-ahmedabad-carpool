# Participant Table Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the participant management table by splitting Area/Pincode columns, enhancing search functionality, and adding a CSV download feature.

**Architecture:** Client-side filtering logic update and CSV generation using the `papaparse` library for local browser downloads.

**Tech Stack:** Next.js (Client Components), Tailwind CSS, Lucide Icons, PapaParse.

---

### Task 1: Enhanced Search Logic

**Files:**
- Modify: `app/admin/participants/ParticipantManager.tsx`

- [ ] **Step 1: Update the `filteredParticipants` search logic**

Update the filter to include `area_name` and `pincode`.

```typescript
// app/admin/participants/ParticipantManager.tsx around line 90
  const filteredParticipants = participants.filter((p: any) => 
    (selectedEventId ? p.event_id === selectedEventId : true) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.phone.includes(searchTerm) ||
     p.area_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.pincode.includes(searchTerm))
  );
```

- [ ] **Step 2: Commit changes**

```bash
git add app/admin/participants/ParticipantManager.tsx
git commit -m "feat: enhance participant search to include area and pincode"
```

---

### Task 2: Split Table Columns

**Files:**
- Modify: `app/admin/participants/ParticipantManager.tsx`

- [ ] **Step 1: Update table header**

Replace the "Area / Pincode" header with two separate headers.

```tsx
// app/admin/participants/ParticipantManager.tsx around line 150
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-sm border-b border-slate-800">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Area</th>
                  <th className="px-6 py-4 font-medium">Pincode</th>
                  <th className="px-6 py-4 font-medium">Mobile</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
```

- [ ] **Step 2: Update table body rows**

Render `area_name` and `pincode` in separate `<td>` elements.

```tsx
// app/admin/participants/ParticipantManager.tsx around line 160
                {filteredParticipants.map((p: any) => (
                  <tr key={p.id} className="text-slate-300 hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                    <td className="px-6 py-4">{p.area_name}</td>
                    <td className="px-6 py-4">{p.pincode}</td>
                    <td className="px-6 py-4">{p.phone}</td>
                    {/* ... actions ... */}
                  </tr>
                ))}
```

- [ ] **Step 3: Commit changes**

```bash
git add app/admin/participants/ParticipantManager.tsx
git commit -m "feat: split Area and Pincode into separate table columns"
```

---

### Task 3: CSV Download Functionality

**Files:**
- Modify: `app/admin/participants/ParticipantManager.tsx`

- [ ] **Step 1: Add the `Download` icon to imports**

```typescript
// app/admin/participants/ParticipantManager.tsx line 4
import { Search, Upload, Plus, Trash2, Edit2, X, Download } from 'lucide-react';
```

- [ ] **Step 2: Implement `handleDownloadCSV` function**

Add the download handler after `handleFileUpload`.

```typescript
// app/admin/participants/ParticipantManager.tsx around line 42
  const handleDownloadCSV = () => {
    if (filteredParticipants.length === 0) {
      alert('No data to download');
      return;
    }

    const csvData = filteredParticipants.map(p => ({
      Name: p.name,
      Mobile: p.phone,
      Email: p.email,
      Area: p.area_name,
      Pincode: p.pincode,
      Address: p.full_address,
      'Offering Ride': p.is_offering_ride ? 'Yes' : 'No',
      'Seats Available': p.seats_available
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const eventTitle = events.find((e: any) => e.id === selectedEventId)?.title || 'participants';
    const filename = `participants-${eventTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
```

- [ ] **Step 3: Add the Download button to the UI**

Insert the button next to "Bulk Upload CSV".

```tsx
// app/admin/participants/ParticipantManager.tsx around line 138
              <button 
                onClick={handleDownloadCSV}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-slate-700"
              >
                <Download className="w-4 h-4" /> Download CSV
              </button>
```

- [ ] **Step 4: Commit changes**

```bash
git add app/admin/participants/ParticipantManager.tsx
git commit -m "feat: add Download CSV functionality for participant lists"
```

- [ ] **Step 5: Final Verification**

Run `npm run build` to ensure no regressions.

```bash
npm run build
```
