import Link from 'next/link';
import { ArrowRight, Car, MapPin, Users, Leaf, ShieldCheck } from 'lucide-react';
import { calculateGreenMetrics } from '@/lib/greenCalc';
import { supabase } from '@/lib/supabase';

export default async function Home() {
  // Fetch total count of participants who have is_offering_ride set to true
  const { count, error } = await supabase
    .from('participants')
    .select('*', { count: 'exact', head: true })
    .eq('is_offering_ride', true);

  if (error) {
    console.error('Error fetching total rides shared:', error);
  }

  const totalRidesShared = count || 0;
  const metrics = calculateGreenMetrics(totalRidesShared);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        
        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 text-blue-300 ring-1 ring-inset ring-blue-500/20 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            Jointly by Sukrut Parivaar & ICAI Ahmedabad Branch
          </div>
          
          <h1 className="max-w-4xl mx-auto text-5xl font-extrabold tracking-tight sm:text-7xl mb-8 leading-tight">
            Share the Drive.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">
              Grow the Network.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-300 mb-10 leading-relaxed">
            The official carpooling platform for CA members and students of ICAI Ahmedabad. 
            Connect with participants from your area, share event rides, reduce traffic, and support our Net Zero mission.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/search" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-8 py-4 text-sm font-semibold text-white hover:bg-amber-500 transition-all shadow-lg shadow-amber-900/20"
            >
              Find Nearby Riders
              <MapPin className="w-4 h-4" />
            </Link>
            <Link 
              href="/events" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 px-8 py-4 text-sm font-semibold text-white ring-1 ring-inset ring-white/10 hover:bg-white/10 transition-all"
            >
              Browse Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">No login required. Just find your event, enter your area or pincode, and instantly connect with other attendees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-950/50 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-14 h-14 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Pin Your Area</h3>
              <p className="text-slate-400 text-sm">Select an upcoming seminar and enter your Pincode or Locality name.</p>
            </div>
            <div className="bg-slate-950/50 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-14 h-14 bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Find Matches</h3>
              <p className="text-slate-400 text-sm">See other CA members and students from your vicinity attending the same event.</p>
            </div>
            <div className="bg-slate-950/50 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-14 h-14 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
                <Car className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Share the Ride</h3>
              <p className="text-slate-400 text-sm">Connect via WhatsApp or call to coordinate your commute and network on the way.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Green Impact Preview */}
      <section className="py-24 bg-slate-950 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl mx-auto">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold tracking-wide text-sm uppercase">
                <Leaf className="w-4 h-4" />
                Net Zero Initiative
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">Every ride shared is a step towards a greener tomorrow.</h2>
              <p className="text-slate-400 text-lg">
                As part of the ICAI Ahmedabad Branch's sustainability goals, this carpooling initiative directly reduces our carbon footprint.
              </p>
              
              <ul className="space-y-4 pt-4">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
                  <span className="text-slate-300">Reduce traffic congestion around ICAI Bhawan.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
                  <span className="text-slate-300">Build strong professional networks from the passenger seat.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
                  <span className="text-slate-300">Save on fuel and parking costs.</span>
                </li>
              </ul>

              <div className="pt-6">
                <Link href="/green" className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors">
                  View Detailed Impact Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
                <div className="text-slate-400 text-sm mb-2">Total Rides Shared</div>
                <div className="text-3xl font-bold text-white">{totalRidesShared.toLocaleString()}</div>
              </div>
              <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
                <div className="text-slate-400 text-sm mb-2">CO₂ Saved</div>
                <div className="text-3xl font-bold text-emerald-400">{metrics.co2SavedKg.toLocaleString()}<span className="text-lg text-emerald-600 ml-1">kg</span></div>
              </div>
              <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
                <div className="text-slate-400 text-sm mb-2">Fuel Saved</div>
                <div className="text-3xl font-bold text-blue-400">{metrics.fuelSavedLitres.toLocaleString()}<span className="text-lg text-blue-600 ml-1">L</span></div>
              </div>
              <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
                <div className="text-slate-400 text-sm mb-2">Trees Equivalent</div>
                <div className="text-3xl font-bold text-green-500">{metrics.treesPlantedEquivalent.toLocaleString()}<span className="text-lg text-green-700 ml-1">trees</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
