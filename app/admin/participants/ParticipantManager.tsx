'use client';

import { useState } from 'react';
import { Search, Upload, Plus, Trash2, Edit2 } from 'lucide-react';
import Papa from 'papaparse';
import { uploadParticipantsBulk } from './actions';

export default function ParticipantManager({ events, initialParticipants = [] }: any) {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [participants, setParticipants] = useState(initialParticipants);
  const [searchTerm, setSearchTerm] = useState('');

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
          window.location.reload();
        } catch (err) {
          alert('Error uploading participants');
        }
      }
    });
  };

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
            <input 
              type="file" 
              id="csv-upload" 
              className="hidden" 
              accept=".csv" 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={() => document.getElementById('csv-upload')?.click()}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
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
