'use client';

import { useState, useEffect } from 'react';

// Vapi.ai Voice Assistant Integration
export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'processing'>('idle');

  useEffect(() => {
    // Initialize Vapi client on mount
    // TODO: Load Vapi SDK with API key from environment
  }, []);

  const startVoiceCall = async () => {
    setStatus('connecting');
    
    try {
      // TODO: Initialize Vapi call with assistant configuration
      // const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
      // await vapi.start(assistantId);
      
      // Simulate connection for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsConnected(true);
      setIsListening(true);
      setStatus('listening');
    } catch (error) {
      console.error('Voice connection error:', error);
      setStatus('idle');
    }
  };

  const endVoiceCall = () => {
    // TODO: End Vapi call
    setIsConnected(false);
    setIsListening(false);
    setTranscript('');
    setStatus('idle');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Collapsed State - Just the button */}
      {!isConnected && (
        <button
          onClick={startVoiceCall}
          disabled={status === 'connecting'}
          className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center group"
        >
          {status === 'connecting' ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
      )}

      {/* Expanded State - Active call */}
      {isConnected && (
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-white font-medium">
                {isListening ? 'Listening...' : 'Processing...'}
              </span>
            </div>
            <button
              onClick={endVoiceCall}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Voice Visualizer */}
          <div className="flex items-center justify-center gap-1 h-16 mb-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-full transition-all ${
                  isListening ? 'animate-pulse' : ''
                }`}
                style={{
                  height: isListening ? `${Math.random() * 40 + 10}px` : '10px',
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="bg-slate-800 rounded-xl p-3 mb-4">
              <p className="text-sm text-slate-300">{transcript}</p>
            </div>
          )}

          {/* Quick Voice Commands */}
          <div className="text-xs text-slate-500 space-y-1">
            <p>Try saying:</p>
            <ul className="list-disc list-inside text-slate-400">
              <li>"I need a 10 HP motor"</li>
              <li>"Check stock for part M-215T"</li>
              <li>"Get me a quote"</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

