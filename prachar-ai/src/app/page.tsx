'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Zap, Copy, Check, Terminal, Layers } from 'lucide-react';

export default function Home() {
  const [businessType, setBusinessType] = useState('');
  const [topic, setTopic] = useState('');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'strategy' | 'visuals'>('strategy');
  
  // Data States
  const [marketingCopy, setMarketingCopy] = useState<any>(null);
  const [generatedImage, setGeneratedImage] = useState('');
  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [imgEngine, setImgEngine] = useState<'flux' | 'turbo'>('flux'); // Added Engine state

  // --- AUTO-SWITCHER LOGIC ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // If the image is currently loading and we are using Flux
    if (loading && imgEngine === 'flux') {
      timer = setTimeout(() => {
        console.warn("⚠️ Flux taking too long. Switching to Turbo Engine for speed...");
        setImgEngine('turbo');
        
        // Update the URL in the state to switch from flux to turbo instantly
        if (generatedImage) {
          const fastUrl = generatedImage
            .replace('model=flux', 'model=turbo')
            .replace('&enhance=true', '');
          setGeneratedImage(fastUrl);
        }
      }, 20000); // 20 Second Grace Period
    }

    return () => clearTimeout(timer);
  }, [loading, imgEngine, generatedImage]);

  // Fake "AI Terminal" logs for effect
  const simulateLogs = () => {
    setLogs([]);
    const steps = [
      "Initializing Neural Networks...",
      `Analyzing market trends for "${businessType}"...`,
      "Synthesizing persuasive copy...",
      "Calibrating visual engine (Flux Pro)...",
      "Rendering final assets..."
    ];
    
    steps.forEach((step, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `> ${step}`]);
      }, index * 800);
    });
  };

  const handleGenerate = async () => {
    if (!businessType || !topic) return;
    setLoading(true);
    setMarketingCopy(null);
    setGeneratedImage('');
    setImgEngine('flux'); // Reset to best quality for every new generation
    simulateLogs();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business: businessType, topic }),
      });

      const data = await response.json();
      
      setTimeout(() => {
        setMarketingCopy(data);
        if (data.imageUrl) {
          setGeneratedImage(data.imageUrl);
          // If image URL is present (from mock or AWS), stop loading immediately
          // The image is already generated and hosted
          setLoading(false);
        }
      }, 4500);

    } catch (error) {
      console.error(error);
      alert('System Overload. Please retry.');
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!marketingCopy) return;
    const text = `${marketingCopy.hook}\n\n${marketingCopy.offer}\n\n${marketingCopy.cta}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative">
      
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>

      <main className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-mono text-gray-400">PRACHAR.AI // SYSTEM ONLINE</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            Create. <span className="text-indigo-500">Dominate.</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            The AI Creative Director for Campus & Creators.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: INPUT */}
          <motion.div 
            className="md:col-span-4 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Brand / Identity</label>
                  <input
                    type="text"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="e.g., Tech Club, College Fest, Food Vlogger"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Campaign Goal</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Hype the new Hackathon, Viral Reel idea"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading || !businessType || !topic}
                  className="w-full relative overflow-hidden bg-white text-black font-bold py-4 rounded-xl group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                    {loading ? (
                      <Layers className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 fill-current" />
                        ✨ GENERATE CAMPAIGN
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Terminal View */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-black border border-white/10 rounded-xl p-4 font-mono text-xs text-green-400 space-y-1 overflow-hidden"
                >
                  {logs.map((log, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                      {log}
                    </motion.div>
                  ))}
                  <div className="animate-pulse">_</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT PANEL: OUTPUT */}
          <motion.div 
            className="md:col-span-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {!marketingCopy ? (
              <div className="h-full min-h-[400px] rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center text-gray-600 space-y-4 border-dashed">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 opacity-20" />
                </div>
                <p className="text-sm font-mono">Awaiting Input Parameters...</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Tabs */}
                <div className="flex gap-4 border-b border-white/10 pb-4">
                  <button 
                    onClick={() => setActiveTab('strategy')}
                    className={`text-sm font-mono pb-2 border-b-2 transition-colors ${activeTab === 'strategy' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500'}`}
                  >
                    01 // STRATEGY CORE
                  </button>
                  <button 
                    onClick={() => setActiveTab('visuals')}
                    className={`text-sm font-mono pb-2 border-b-2 transition-colors ${activeTab === 'visuals' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500'}`}
                  >
                    02 // VISUAL ASSETS
                  </button>
                </div>

                {/* Content Area */}
                <AnimatePresence mode='wait'>
                  {activeTab === 'strategy' ? (
                    <motion.div
                      key="strategy"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative group hover:border-indigo-500/30 transition-colors">
                        <button 
                          onClick={copyToClipboard}
                          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <div className="space-y-6">
                          <div>
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">The Hook</span>
                            <h3 className="text-2xl font-bold mt-1 leading-tight">{marketingCopy.hook}</h3>
                          </div>
                          
                          <div className="h-px bg-white/10 w-full"></div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">The Offer</span>
                              <p className="text-lg text-gray-300 mt-1">{marketingCopy.offer}</p>
                            </div>
                            <div>
                              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">Action</span>
                              <p className="text-lg text-gray-300 mt-1">{marketingCopy.cta}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="visuals"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 bg-black group flex items-center justify-center">
                        
                        {generatedImage && (
                          <img 
                            key={`${generatedImage}-${refreshKey}`}
                            src={`${generatedImage}${generatedImage.includes('?') ? '&' : '?'}cache_bust=${refreshKey}`} 
                            alt="Campaign Creative" 
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* LOADING OVERLAY - Only show when loading is true */}
                        {loading && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
                            <div className="relative">
                              <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full"></div>
                              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            
                            <div className="mt-6 text-center space-y-2">
                              <p className="text-xs font-mono text-indigo-400 animate-pulse uppercase tracking-[0.2em]">
                                {imgEngine === 'flux' ? "Synthesizing 8K Assets" : "Optimizing Visual Stream"}
                              </p>
                              <p className="text-[10px] text-gray-500 font-mono">
                                {imgEngine === 'flux' ? "ESTIMATED ARRIVAL: 15-20 SECONDS" : "SWITCHING TO TURBO FOR SPEED..."}
                              </p>
                            </div>

                            <div className="absolute bottom-8 px-6 text-center">
                              <p className="text-[9px] text-gray-600 uppercase tracking-tighter">
                                {imgEngine === 'flux' 
                                  ? "Waiting for Flux Engine response..." 
                                  : "Turbo Engine engaged for low-latency delivery."}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 z-20">
                          <span className="px-2 py-1 rounded bg-black/50 backdrop-blur text-[10px] font-mono border border-white/10 text-indigo-300">
                            ENGINE // {imgEngine.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* MANUAL OVERRIDE BUTTON */}
                      <button 
                        onClick={() => {
                          setRefreshKey(prev => prev + 1);
                          setImgEngine('flux'); // Try flux again on manual refresh
                          setLoading(true);
                        }}
                        className="w-full py-3 rounded-xl border border-white/5 bg-white/5 text-[10px] font-mono text-gray-500 hover:bg-white/10 transition-colors uppercase tracking-widest"
                      >
                        Visual taking too long? Force Re-render
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}
          </motion.div>

        </div>
      </main>
    </div>
  );
}