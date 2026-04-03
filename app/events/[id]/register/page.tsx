'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { geocodeLocation } from '@/lib/geocode';
import Link from 'next/link';
import { ArrowLeft, Loader2, MapPin, CheckCircle } from 'lucide-react';

export default function RegisterRidePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [eventData, setEventData] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    whatsapp_number: '',
    area_name: '',
    pincode: '',
    full_address: '',
    linkedin_url: '',
    is_offering_ride: false,
    seats_available: 1,
  });

  useEffect(() => {
    // Fetch basic event info just to show the title
    async function fetchEvent() {
      const { data } = await supabase.from('events').select('title, event_date').eq('id', params.id).single();
      if (data) setEventData(data);
    }
    fetchEvent();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Geocode the provided pincode + area to get rough lat/lng
      const geocodeQuery = `${formData.area_name}, ${formData.pincode}`;
      const location = await geocodeLocation(geocodeQuery);
      
      // 2. Insert into Supabase
      const { data, error } = await supabase
        .from('participants')
        .insert([
          {
            event_id: params.id,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            whatsapp_number: formData.whatsapp_number || formData.phone, // Default WA to phone
            area_name: formData.area_name,
            pincode: formData.pincode,
            full_address: formData.full_address,
            linkedin_url: formData.linkedin_url,
            is_offering_ride: formData.is_offering_ride,
            seats_available: formData.is_offering_ride ? Number(formData.seats_available) : 0,
            latitude: location?.lat || null,
            longitude: location?.lng || null,
          }
        ]);

      if (error) throw error;
      
      setSuccess(true);
      // Wait 3 seconds and redirect to event page
      setTimeout(() => {
        router.push(`/events/${params.id}`);
        router.refresh();
      }, 3000);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-lg text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Registration Successful!</h1>
          <p className="text-slate-400 mb-8">You have been added to the carpool list. Others can now find you on the map and connect.</p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to event page...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href={`/events/${params.id}`} className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Event
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 md:p-8 border-b border-slate-800 bg-slate-950/50">
          <h1 className="text-2xl font-bold text-white mb-2">Join Event Carpool</h1>
          <p className="text-slate-400 text-sm">
            Please fill out your details so others from your area can connect with you. No login required.
          </p>
          {eventData && (
             <div className="mt-4 p-3 bg-blue-900/20 border border-blue-900/50 rounded-lg text-blue-200 text-sm">
               Registering for: <span className="font-semibold text-blue-300">{eventData.title}</span>
             </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 bg-slate-900">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">
              {errorMsg}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Full Name <span className="text-red-500">*</span></label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="CA John Doe" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email ID <span className="text-red-500">*</span></label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="johndoe@email.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Mobile Number <span className="text-red-500">*</span></label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="+91 9876543210" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                WhatsApp Number 
                <span className="text-xs text-slate-500 font-normal">(if different)</span>
              </label>
              <input type="tel" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="+91 9876543210" />
            </div>
          </div>

          <hr className="border-slate-800 my-6" />

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400"><MapPin className="w-4 h-4" /> Location Details</h3>
            
            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Area / Locality <span className="text-red-500">*</span></label>
                <input required name="area_name" value={formData.area_name} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="e.g. Bopal, Maninagar" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Pincode <span className="text-red-500">*</span></label>
                <input required name="pincode" value={formData.pincode} onChange={handleChange} maxLength={6} pattern="[0-9]{6}" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="3800..." />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                Full Address 
                <span className="text-xs text-slate-500 font-normal">(Optional, helps pin exact location)</span>
              </label>
              <input name="full_address" value={formData.full_address} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="House/Flat No, Society, Street" />
            </div>
          </div>

          <hr className="border-slate-800 my-6" />

          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Networking & Ride Info</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                LinkedIn Profile URL
                <span className="text-xs text-slate-500 font-normal">(Optional)</span>
              </label>
              <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="https://linkedin.com/in/username" />
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="is_offering_ride" id="toggle" checked={formData.is_offering_ride} onChange={handleChange} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-slate-400 border-4 appearance-none cursor-pointer border-slate-700 transition-all checked:bg-blue-500 checked:right-0 checked:border-blue-600 top-0 right-6" style={{right: formData.is_offering_ride ? '0' : '1.5rem', borderColor: formData.is_offering_ride ? '#2563eb' : '#334155', backgroundColor: formData.is_offering_ride ? 'white' : '#94a3b8'}}/>
                  <div className="block overflow-hidden h-6 rounded-full bg-slate-800 cursor-pointer" style={{backgroundColor: formData.is_offering_ride ? '#1e3a8a' : '#1e293b'}}></div>
                </div>
                <div>
                  <div className="font-semibold text-white">I am offering a ride</div>
                  <div className="text-xs text-slate-400">Turn this on if you are driving and have empty seats.</div>
                </div>
              </label>

              {formData.is_offering_ride && (
                <div className="mt-4 pt-4 border-t border-slate-800 animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm font-medium text-slate-300 block mb-2">Available Seats</label>
                  <select name="seats_available" value={formData.seats_available} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none">
                    <option value="1">1 Seat</option>
                    <option value="2">2 Seats</option>
                    <option value="3">3 Seats</option>
                    <option value="4">4 Seats</option>
                    <option value="5">5+ Seats</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                'Confirm Registration'
              )}
            </button>
            <p className="text-xs text-center text-slate-500 mt-4">
              By registering, you agree that your contact information will be visible to other users of this platform for carpooling purposes.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
