'use client';

import dynamic from 'next/dynamic';
import type { Participant } from './ParticipantCard';

const DynamicMap = dynamic(() => import('./ParticipantMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center">
      <div className="animate-pulse text-slate-500">Loading interactive map...</div>
    </div>
  ),
});

export default function ParticipantMapWrapper({ participants }: { participants: Participant[] }) {
  return <DynamicMap participants={participants} />;
}
