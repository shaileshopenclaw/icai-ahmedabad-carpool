import { MapPin, Phone, MessageCircle, Mail, ExternalLink, UserCircle2, Map } from 'lucide-react';

export type Participant = {
  id: string;
  name: string;
  phone: string;
  email: string;
  whatsapp_number?: string;
  area_name: string;
  pincode: string;
  full_address?: string;
  linkedin_url?: string;
  is_offering_ride: boolean;
  seats_available: number;
  latitude?: number;
  longitude?: number;
};

export default function ParticipantCard({ participant }: { participant: Participant }) {
  const waNumber = participant.whatsapp_number || participant.phone;
  // Clean number for WA link: remove non-numeric chars
  const cleanWaNumber = waNumber.replace(/\D/g, ''); 
  // Assume Indian number if no country code provided and length is 10
  const finalWaNumber = cleanWaNumber.length === 10 ? `91${cleanWaNumber}` : cleanWaNumber;
  
  const waLink = `https://wa.me/${finalWaNumber}?text=Hi ${encodeURIComponent(participant.name.split(' ')[0])}, I saw your post on ICAI Ahmedabad CarPool.`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
               {/* Using an icon instead of an image to keep it lightweight and private */}
              <UserCircle2 className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{participant.name}</h3>
              <div className="flex items-center text-xs text-slate-400 mt-0.5">
                <MapPin className="w-3 h-3 mr-1" />
                {participant.area_name} ({participant.pincode})
              </div>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
            participant.is_offering_ride 
              ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' 
              : 'bg-amber-900/30 text-amber-500 border-amber-800/50'
          }`}>
            {participant.is_offering_ride ? `Offering ${participant.seats_available} Seats` : 'Needs a Ride'}
          </div>
        </div>

        {participant.full_address && (
          <div className="mb-4 text-sm text-slate-400 bg-slate-950/50 p-2.5 rounded-lg flex gap-2 items-start">
             <Map className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
             <span className="line-clamp-2 leading-relaxed">{participant.full_address}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/50">
          <a rel="noopener noreferrer"
            href={waLink}
            target="_blank"
            className="flex items-center justify-center gap-1.5 w-full bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 border border-emerald-500/20 py-2 rounded font-medium text-xs transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </a>

          <a 
            href={`tel:${participant.phone}`}
            className="flex items-center justify-center gap-1.5 w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded font-medium text-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
        </div>
      </div>
      
      <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex justify-between items-center text-xs">
        <a href={`mailto:${participant.email}`} className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
          <Mail className="w-3.5 h-3.5" /> Email
        </a>
        
        {participant.linkedin_url && (
            <a 
              href={participant.linkedin_url} 
              target="_blank" 
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Profile
            </a>
        )}
      </div>
    </div>
  );
}
