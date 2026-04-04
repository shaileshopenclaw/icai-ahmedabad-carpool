'use client';

import { useState } from 'react';
import { Search, Upload, Plus, Trash2, Edit2, X } from 'lucide-react';
import Papa from 'papaparse';
import { uploadParticipantsBulk, deleteParticipant, addParticipant, updateParticipant } from './actions';

export default function ParticipantManager({ events, initialParticipants = [] }: any) {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [participants, setParticipants] = useState<any[]>(initialParticipants);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<any>(null);

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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this participant?')) {
      try {
        await deleteParticipant(id);
        setParticipants((prev: any[]) => prev.filter(p => p.id !== id));
      } catch (err) {
        alert('Error deleting participant');
      }
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData);
    
    // Handle checkbox and number types
    data.is_offering_ride = formData.get('is_offering_ride') === 'on';
    data.seats_available = parseInt(data.seats_available as string) || 0;
    
    try {
      if (editingParticipant) {
        await updateParticipant(editingParticipant.id, data);
        setParticipants(prev => prev.map(p => p.id === editingParticipant.id ? { ...p, ...data } : p));
      } else {
        const newParticipant = await addParticipant({ ...data, event_id: selectedEventId });
        setParticipants(prev => [...prev, newParticipant]);
      }
      setIsModalOpen(false);
      setEditingParticipant(null);
    } catch (err) {
      alert('Error saving participant');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingParticipant(null);
  };

  const filteredParticipants = participants.filter((p: any) => 
    (selectedEventId ? p.event_id === selectedEventId : true) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.phone.includes(searchTerm) ||
     p.area_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.pincode.includes(searchTerm))
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
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setEditingParticipant(null);
                  setIsModalOpen(true);
                }}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Participant
              </button>
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
          </div>

          {/* Participant Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-sm border-b border-slate-800">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Area</th>
                  <th className="px-6 py-4 font-medium">Pincode</th>
                  <th className="px-6 py-4 font-medium">Mobile</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredParticipants.map((p: any) => (
                  <tr key={p.id} className="text-slate-300 hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                    <td className="px-6 py-4">{p.area_name}</td>
                    <td className="px-6 py-4">{p.pincode}</td>
                    <td className="px-6 py-4">{p.phone}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingParticipant(p);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-full transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl my-8">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                {editingParticipant ? 'Edit Participant' : 'Add Participant'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                  <input name="name" defaultValue={editingParticipant?.name} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Mobile Number</label>
                  <input name="phone" defaultValue={editingParticipant?.phone} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <input name="email" type="email" defaultValue={editingParticipant?.email} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">WhatsApp (Optional)</label>
                  <input name="whatsapp_number" defaultValue={editingParticipant?.whatsapp_number} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Area Name</label>
                  <input name="area_name" defaultValue={editingParticipant?.area_name} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Pincode</label>
                  <input name="pincode" defaultValue={editingParticipant?.pincode} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="is_offering_ride" 
                    name="is_offering_ride" 
                    defaultChecked={editingParticipant?.is_offering_ride} 
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500" 
                  />
                  <label htmlFor="is_offering_ride" className="text-sm font-medium text-slate-400">Offering a Ride?</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Seats Available</label>
                  <input name="seats_available" type="number" defaultValue={editingParticipant?.seats_available || 0} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Full Address</label>
                <textarea name="full_address" defaultValue={editingParticipant?.full_address} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 h-24" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">LinkedIn URL (Optional)</label>
                <input name="linkedin_url" defaultValue={editingParticipant?.linkedin_url} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors">
                  Save Participant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
