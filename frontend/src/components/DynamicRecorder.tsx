'use client';

import dynamic from 'next/dynamic';

const Recorder = dynamic(() => import('./Recorder').then(mod => ({ default: mod.Recorder })), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div className="text-2xl font-semibold text-gray-800">
        Loading Recorder...
      </div>
    </div>
  ),
});

export { Recorder }; 