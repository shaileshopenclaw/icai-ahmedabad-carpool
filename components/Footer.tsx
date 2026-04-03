export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 py-12 text-slate-400">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="font-bold text-lg tracking-tight mb-4">
            <span className="text-white">ICAI</span>
            <span className="text-amber-500">Ahmedabad</span>
            <span className="text-slate-400 font-normal ml-1">CarPool</span>
          </div>
          <p className="text-sm">
            Connecting CA professionals and students to share rides, build networks, and reduce our carbon footprint.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/events" className="hover:text-amber-500 transition-colors">Upcoming Events</a></li>
            <li><a href="/search" className="hover:text-amber-500 transition-colors">Find a Ride</a></li>
            <li><a href="/green" className="hover:text-amber-500 transition-colors">Green Impact</a></li>
            <li><a href="https://icaiahmedabad.com" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors">Main Website</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4">Branch Office</h3>
          <address className="not-italic text-sm space-y-2">
            <p>Ahmedabad Branch of WIRC of ICAI</p>
            <p>123 ICAI Bhawan, Naranpura,</p>
            <p>Ahmedabad, Gujarat 380014</p>
            <p className="mt-4"><a href="mailto:ahmedabad@icai.org" className="text-blue-400 hover:underline">ahmedabad@icai.org</a></p>
          </address>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-sm text-center">
        <p>© {new Date().getFullYear()} Ahmedabad Branch of WIRC of ICAI. All rights reserved.</p>
        <p className="mt-2 text-xs text-slate-500">Designed to support the Net Zero Initiative.</p>
      </div>
    </footer>
  );
}
