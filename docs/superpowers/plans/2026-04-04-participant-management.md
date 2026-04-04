# Participant Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an admin interface to bulk upload participants via CSV and manually manage them (Add, Edit, Delete) for specific events.

**Architecture:** A new admin route `/admin/participants` using Next.js Server Components for the dashboard and Client Components for interactive CSV parsing. Server Actions handle all database mutations in Supabase.

**Tech Stack:** Next.js (App Router), Supabase, Tailwind CSS, Lucide React (Icons), PapaParse (for CSV parsing).

---

### Task 1: Setup Route and Navigation

**Files:**
- Create: `app/admin/participants/page.tsx`
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Create the basic participants page**

```tsx
import { checkAdmin } from '../actions';
import { supabase } from '@/lib/supabase';

export default async function ParticipantsPage() {
  await checkAdmin();

  const { data: events } = await supabase
    .from('events')
    .select('id, title')
    .order('event_date', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-white">Manage Participants</h1>
      <div className="grid gap-8">
        {/* Event Selector will go here */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
          Select an event to manage participants
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add navigation link to Navbar**

```tsx
// Find where /admin/events is linked and add /admin/participants
<Link href="/admin/participants" className="text-slate-300 hover:text-white transition-colors">
  Participants
</Link>
```

- [ ] **Step 3: Verify page loads**

Run: `curl -I http://localhost:3000/admin/participants` (Note: requires admin_auth cookie if testing in browser)
Expected: 200 OK (or 302 to /admin if not logged in)

- [ ] **Step 4: Commit**

```bash
git add app/admin/participants/page.tsx components/Navbar.tsx
git commit -m "feat: add participants admin route and navigation"
```

---

### Task 2: Implement Server Actions for Participants

**Files:**
- Create: `app/admin/participants/actions.ts`

- [ ] **Step 1: Define management actions**

```tsx
'use server';

import { supabase } from '@/lib/supabase';
import { checkAdmin } from '../actions';
import { revalidatePath } from 'next/cache';

export async function addParticipant(data: any) {
  await checkAdmin();
  const { error } = await supabase.from('participants').insert([data]);
  if (error) throw error;
  revalidatePath('/admin/participants');
}

export async function updateParticipant(id: string, data: any) {
  await checkAdmin();
  const { error } = await supabase.from('participants').update(data).eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/participants');
}

export async function deleteParticipant(id: string) {
  await checkAdmin();
  const { error } = await supabase.from('participants').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/participants');
}

export async function uploadParticipantsBulk(eventId: string, participants: any[]) {
  await checkAdmin();
  const data = participants.map(p => ({ ...p, event_id: eventId }));
  const { error } = await supabase.from('participants').insert(data);
  if (error) throw error;
  revalidatePath('/admin/participants');
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/participants/actions.ts
git commit -m "feat: add server actions for participant management"
```

---

### Task 3: Build Event Selector and Participant List

**Files:**
- Create: `app/admin/participants/ParticipantManager.tsx` (Client Component)
- Modify: `app/admin/participants/page.tsx`

- [ ] **Step 1: Create ParticipantManager component**

```tsx
'use client';

import { useState } from 'react';
import { Search, Upload, Plus, Trash2, Edit2 } from 'lucide-react';

export default function ParticipantManager({ events, initialParticipants = [] }: any) {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [participants, setParticipants] = useState(initialParticipants);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParticipants = participants.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <label className="block text-sm font-medium text-slate-400 mb-2">Select Event</label>
        <select 
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
        >
          <option value="">-- Choose an Event --</option>
          {events.map((e: any) => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      {selectedEventId && (
        <>
          {/* CSV Upload & Search Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                placeholder="Search participants..." 
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Upload className="w-4 h-4" /> Bulk Upload CSV
            </button>
          </div>

          {/* Participant Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-sm border-b border-slate-800">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Area / Pincode</th>
                  <th className="px-6 py-4 font-medium">Mobile</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredParticipants.map((p: any) => (
                  <tr key={p.id} className="text-slate-300 hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                    <td className="px-6 py-4">{p.area_name} ({p.pincode})</td>
                    <td className="px-6 py-4">{p.phone}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-full transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update page.tsx to use Manager**

```tsx
import ParticipantManager from './ParticipantManager';
// ... existing imports

export default async function ParticipantsPage() {
  await checkAdmin();
  const { data: events } = await supabase.from('events').select('id, title').order('event_date', { ascending: false });
  const { data: participants } = await supabase.from('participants').select('*');

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-white">Manage Participants</h1>
      <ParticipantManager events={events || []} initialParticipants={participants || []} />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/participants/ParticipantManager.tsx app/admin/participants/page.tsx
git commit -m "feat: implement participant manager UI with event selection"
```

---

### Task 4: CSV Upload Logic

**Files:**
- Modify: `app/admin/participants/ParticipantManager.tsx`

- [ ] **Step 1: Add PapaParse and Upload logic**

```bash
npm install papaparse
npm install --save-dev @types/papaparse
```

- [ ] **Step 2: Implement handleFileUpload**

```tsx
import Papa from 'papaparse';
import { uploadParticipantsBulk } from './actions';

// Inside ParticipantManager component:
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const mappedData = results.data.map((row: any) => ({
        name: row.Name || row.name || '',
        phone: row.Mobile || row.mobile || row.Phone || row.phone || '',
        area_name: row.Area || row.area || '',
        pincode: row.Pincode || row.pincode || '',
        full_address: row.Address || row.address || '',
        email: row.Email || row.email || '',
      }));
      
      try {
        await uploadParticipantsBulk(selectedEventId, mappedData);
        alert('Bulk upload successful!');
      } catch (err) {
        alert('Error uploading participants');
      }
    }
  });
};

// Add hidden input for file:
<input type="file" id="csv-upload" className="hidden" accept=".csv" onChange={handleFileUpload} />
<button onClick={() => document.getElementById('csv-upload')?.click()} ...>
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/participants/ParticipantManager.tsx package.json
git commit -m "feat: implement CSV bulk upload with PapaParse"
```

---

### Task 5: Manual Management (Add/Edit/Delete)

**Files:**
- Modify: `app/admin/participants/ParticipantManager.tsx`

- [ ] **Step 1: Implement Delete functionality**

```tsx
import { deleteParticipant } from './actions';

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this participant?')) {
    await deleteParticipant(id);
    setParticipants(prev => prev.filter(p => p.id !== id));
  }
};
```

- [ ] **Step 2: Implement Add/Edit Modal (Brevity: showing logic)**

```tsx
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingParticipant, setEditingParticipant] = useState<any>(null);

const handleSave = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  if (editingParticipant) {
    await updateParticipant(editingParticipant.id, data);
  } else {
    await addParticipant({ ...data, event_id: selectedEventId });
  }
  setIsModalOpen(false);
};
```

- [ ] **Step 3: Commit final management features**

```bash
git add app/admin/participants/ParticipantManager.tsx
git commit -m "feat: add manual edit and delete for participants"
```
