import Link from 'next/link';
import { CarFront, Calendar, Search, Leaf, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center group-hover:bg-blue-500 transition-colors">
            <CarFront className="w-5 h-5 text-white" />
          </div>
          <div className="font-bold text-lg tracking-tight">
            <span className="text-white">ICAI</span>
            <span className="text-amber-500">Ahmedabad</span>
            <span className="text-slate-400 font-normal ml-1">CarPool</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/events" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <Calendar className="w-4 h-4" />
            Events
          </Link>
          <Link href="/search" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <Search className="w-4 h-4" />
            Find Rides
          </Link>
          <Link href="/green" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
            <Leaf className="w-4 h-4" />
            Impact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
             <ShieldAlert className="w-3 h-3" />
             Admin
          </Link>
          <Link 
            href="/events" 
            className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2"
          >
            Offer a Ride
          </Link>
        </div>
      </div>
    </header>
  );
}
