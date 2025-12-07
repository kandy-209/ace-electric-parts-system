'use client';

import { useState } from 'react';

export default function VoiceAssistant() {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening'>('idle');

  const startVoiceCall = async () => {
    setStatus('connecting');
    
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsConnected(true);
    setIsListening(true);
    setStatus('listening');
  };

  const endVoiceCall = () => {
    setIsConnected(false);
    setIsListening(false);
    setStatus('idle');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Button */}
      {!isConnected && (
        <button
          onClick={startVoiceCall}
          disabled={status === 'connecting'}
          className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all flex items-center justify-center"
        >
          {status === 'connecting' ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
      )}

      {/* Active Call */}
      {isConnected && (
        <div className="bg-black border border-white/10 rounded-2xl p-4 w-72 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-500'}`} />
              <span className="text-sm text-white font-medium">
                {isListening ? 'Listening...' : 'Processing...'}
              </span>
            </div>
            <button
              onClick={endVoiceCall}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Visualizer */}
          <div className="flex items-center justify-center gap-1 h-12 mb-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-full transition-all"
                style={{
                  height: isListening ? `${Math.random() * 32 + 8}px` : '8px',
                }}
              />
            ))}
          </div>

          <p className="text-xs text-neutral-500 text-center">
            Say "I need a motor" or "Get me a quote"
          </p>
        </div>
      )}
    </div>
  );
}
