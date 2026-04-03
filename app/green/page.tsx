import { calculateGreenMetrics } from '@/lib/greenCalc';
import { Leaf, Wind, Droplets, Banknote, TreePine } from 'lucide-react';
// import { supabase } from '@/lib/supabase';

// Helper to format large numbers
const compactNum = (num: number) => Intl.NumberFormat('en-IN', { notation: "compact", maximumFractionDigits: 1 }).format(num);

export default async function GreenImpactPage() {
  // In a real database, we would query the total rides shared or calculate it by summing seats_available.
  // For immediate visual impact, we mock a realistic branch metric.
  const totalRidesShared = 3450; 
  const metrics = calculateGreenMetrics(totalRidesShared);

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Hero Header */}
      <div className="relative bg-emerald-950/30 border-b border-emerald-900/30 pt-20 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-32 -mt-32">
           <Leaf className="w-96 h-96 text-emerald-500/5 rotate-45 transform" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20 mb-6 font-medium text-sm">
            <TreePine className="w-4 h-4" /> ICAI Ahmedabad Net Zero Initiative
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Our Green Impact</h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            By choosing to carpool, the Chartered Accountants and students of Ahmedabad are driving a massive change. Look at what we have achieved together.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          
          <div className="bg-slate-900 border border-emerald-900/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <Leaf className="w-32 h-32" />
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/30">
              <Wind className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-slate-400 font-medium mb-1">CO₂ Prevented</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{compactNum(metrics.co2SavedKg)}</span>
              <span className="text-emerald-500 font-semibold">kg</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <Droplets className="w-32 h-32" />
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/30">
              <Droplets className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-slate-400 font-medium mb-1">Fuel Saved</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{compactNum(metrics.fuelSavedLitres)}</span>
              <span className="text-blue-500 font-semibold">Litres</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-amber-500/50 transition-colors">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <Banknote className="w-32 h-32" />
            </div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 border border-amber-500/30">
              <Banknote className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-slate-400 font-medium mb-1">Money Saved</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">₹{compactNum(metrics.moneySavedINR)}</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-green-500/50 transition-colors">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <TreePine className="w-32 h-32" />
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 border border-green-500/30">
              <TreePine className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-slate-400 font-medium mb-1">Tree Equivalent*</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{compactNum(metrics.treesPlantedEquivalent)}</span>
              <span className="text-green-500 font-semibold text-sm">Trees/yr</span>
            </div>
          </div>

        </div>

        <div className="max-w-3xl mx-auto mt-20 text-center text-slate-400 bg-slate-900/50 p-6 rounded-xl border border-slate-800/50 text-sm">
          <p>
            <strong>* How we calculate this:</strong> We estimate an average round trip of 20km for attendees within Ahmedabad. 
            A standard car emits ~0.21 kg of CO2 per km. A mature tree absorbs roughly 21 kg of CO2 per year. 
            By sharing exactly one ride, you effectively take one car off the road. <br/><br/>
            As financial professionals, we understand that small, compounding habits create massive long-term wealth. The same applies to our environment.
          </p>
        </div>
      </div>
    </div>
  );
}
