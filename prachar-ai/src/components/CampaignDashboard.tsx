'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Terminal, Activity, Database, Globe, Copy, Check, Zap, LogOut, Menu, X, Plus, Download, BookOpen } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  displayContent?: string; // For showing friendly message instead of raw JSON
}

interface CampaignAsset {
  hook: string;
  offer: string;
  cta: string;
}

interface CampaignData {
  campaignId?: string;
  plan: CampaignAsset;
  captions: string[];
  image_url?: string;
  messages?: Message[];
  status?: string;
}

interface CampaignDashboardProps {
  accessToken: string;
  userEmail: string;
  onLogout?: () => void;
}

// Advanced JSON Parser - Extracts campaign data from Director's response
function extractCampaignData(text: string): { campaign: CampaignData | null; displayMessage: string } {
  try {
    let jsonStr = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonStr = jsonMatch[0];
    
    const parsed = JSON.parse(jsonStr);
    
    const hook = parsed.plan?.hook || parsed.hook || '';
    const offer = parsed.plan?.offer || parsed.offer || '';
    const cta = parsed.plan?.cta || parsed.cta || '';
    const captions = parsed.captions || [];
    
    if (hook || captions.length > 0) {
      const campaign: CampaignData = {
        plan: { hook, offer, cta },
        captions,
        image_url: parsed.imageUrl || parsed.image_url,
        campaignId: parsed.campaignId,
        status: parsed.status
      };
      
      return { campaign, displayMessage: '✅ Strategic Campaign Compiled. See the Canvas below.' };
    }
  } catch (e) {
    console.error("Parse error:", e);
  }
  
  return { campaign: null, displayMessage: text };
}

export default function CampaignDashboard({ accessToken, userEmail, onLogout }: CampaignDashboardProps) {
  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Campaign States
  const [currentCampaign, setCurrentCampaign] = useState<CampaignData | null>(null);
  
  // UI States
  const [copied, setCopied] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState({
    tier: 'STANDBY',
    dbSync: 'OK',
    region: 'US-EAST-1'
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleGenerate = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);
    setSystemStatus(prev => ({ ...prev, tier: 'TIER_1' }));

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          goal: inputValue,
          messages: messages.concat(userMessage)
        }),
      });

      const data = await response.json();

      // Parse campaign data from response
      let campaignData: CampaignData | null = null;
      let displayMessage = '';

      // Check if response has direct campaign structure
      if (data.plan && data.captions) {
        campaignData = {
          plan: data.plan,
          captions: data.captions,
          image_url: data.imageUrl || data.image_url,
          campaignId: data.campaignId,
          status: data.status
        };
        displayMessage = '✅ Strategic Campaign Compiled. See the Canvas below.';
      } else if (data.hook && data.offer && data.cta) {
        // Alternative format
        campaignData = {
          plan: {
            hook: data.hook,
            offer: data.offer,
            cta: data.cta
          },
          captions: data.captions || [],
          image_url: data.imageUrl || data.image_url,
          campaignId: data.campaignId,
          status: data.status
        };
        displayMessage = '✅ Strategic Campaign Compiled. See the Canvas below.';
      } else {
        // Try to extract from raw response
        const rawText = JSON.stringify(data);
        const extracted = extractCampaignData(rawText);
        campaignData = extracted.campaign;
        displayMessage = extracted.displayMessage;
      }

      // Update campaign state if valid data found
      if (campaignData) {
        setCurrentCampaign(campaignData);
        setSystemStatus(prev => ({ ...prev, tier: 'ACTIVE', dbSync: 'SYNCED' }));
      }

      // Add assistant message with display content
      const assistantMessage: Message = {
        role: 'assistant',
        content: JSON.stringify(data),
        displayContent: displayMessage
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Generation failed:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'System Overload. Retry command.',
        displayContent: '❌ System Overload. Retry command.'
      };
      setMessages(prev => [...prev, errorMessage]);
      setSystemStatus(prev => ({ ...prev, tier: 'ERROR' }));
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* Radial Glow Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl"></div>
      </div>

      {/* Mobile Header (Hamburger + Branding + Status) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono font-bold">PRACHAR.AI // WAR ROOM</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-indigo-400" />
              <span className={`font-bold ${
                systemStatus.tier === 'ACTIVE' ? 'text-green-400' :
                systemStatus.tier === 'ERROR' ? 'text-red-400' :
                systemStatus.tier.startsWith('TIER') ? 'text-yellow-400' :
                'text-zinc-400'
              }`}>
                {systemStatus.tier === 'STANDBY' ? 'RDY' : systemStatus.tier.replace('TIER_', 'T')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR - SLIDE-OUT DRAWER ON MOBILE, FIXED ON DESKTOP */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`fixed inset-y-0 lg:bottom-[44px] left-0 z-50 w-[80%] max-w-[400px] transform transition-transform duration-300 lg:fixed lg:translate-x-0 lg:w-[400px] border-r border-zinc-800 flex flex-col bg-zinc-900 lg:bg-zinc-900/50 backdrop-blur-xl ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        
        {/* Sidebar Header - Visible on Both Mobile and Desktop */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm font-mono font-bold text-white">DIRECTOR'S TERMINAL</h2>
            </div>
            <div className="flex items-center gap-2">
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-red-400"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-white font-medium truncate">{userEmail}</p>
        </div>

        {/* Tactical Navigation Menu */}
        <div className="p-4 space-y-2">
          {/* New Directive - Reset State */}
          <button 
            onClick={() => {
              setMessages([]);
              setCurrentCampaign(null);
              setInputValue('');
              setIsMobileSidebarOpen(false);
              setSystemStatus({ tier: 'STANDBY', dbSync: 'OK', region: 'US-EAST-1' });
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-indigo-500/50 hover:bg-zinc-800 cursor-pointer transition-colors group"
          >
            <Plus className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
            <span className="text-sm font-mono text-white group-hover:text-indigo-100">New Directive</span>
          </button>
          
          {/* Export Campaign - Download JSON */}
          <button 
            onClick={() => {
              if (messages.length > 0) {
                const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'prachar_campaign.json';
                a.click();
                URL.revokeObjectURL(url);
                setIsMobileSidebarOpen(false);
              } else {
                console.warn('No campaign data to export');
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-purple-500/50 hover:bg-zinc-800 cursor-pointer transition-colors group"
          >
            <Download className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
            <span className="text-sm font-mono text-white group-hover:text-purple-100">Export Campaign</span>
          </button>
          
          {/* View Architecture - Link to GitHub */}
          <button 
            onClick={() => {
              window.open('https://github.com/SxBxcoder/Prachar.ai', '_blank');
              setIsMobileSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-cyan-500/50 hover:bg-zinc-800 cursor-pointer transition-colors group"
          >
            <BookOpen className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
            <span className="text-sm font-mono text-white group-hover:text-cyan-100">View Architecture</span>
          </button>
        </div>

        {/* Spacer - Desktop Only */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-mono text-zinc-400">COMMAND CENTER</p>
              <p className="text-xs text-zinc-600">Enter directive below</p>
            </div>
          </div>
        </div>

        {/* Input Area - Desktop Only */}
        <div className="hidden lg:flex flex-col p-4 border-t border-zinc-800">
          <div className="space-y-3">
            <label className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Campaign Directive</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Enter campaign directive..."
                disabled={isGenerating}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !inputValue.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-4 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split-Pane Layout */}
      <div className="flex-1 flex relative z-10 pt-14 lg:pt-0 lg:pl-0 overflow-hidden">
        
        {/* Spacer for sidebar on desktop - takes up the sidebar width */}
        <div className="hidden lg:block w-[400px] flex-shrink-0"></div>

        {/* RIGHT CANVAS */}
        <div className="flex-1 h-full overflow-y-auto p-4 lg:p-8 pb-32 lg:pb-8 flex flex-col bg-black relative">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-50 m-auto min-h-[50vh]">
              <Sparkles className="w-12 h-12 mb-4 animate-pulse text-zinc-600" />
              <p className="tracking-widest text-sm text-zinc-600">AWAITING DIRECTIVE...</p>
              <p className="text-xs mt-2 text-zinc-700">Enter a campaign goal to begin</p>
            </div>
          ) : (
            <div className="flex flex-col w-full h-auto">
              <div className="flex items-center space-x-2 text-cyan-500 mb-8 shrink-0">
                <Activity className="w-5 h-5" />
                <span className="text-sm tracking-widest font-bold">ACTIVE INTELLIGENCE FEED</span>
              </div>
              
              <div className="flex flex-col w-full space-y-6 shrink-0">
                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                    >
                      <div
                        className={`max-w-[85%] lg:max-w-[70%] rounded-2xl p-4 ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white ml-auto'
                            : 'bg-zinc-900 text-zinc-100 border border-zinc-800'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {msg.displayContent || msg.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[85%] lg:max-w-[70%] rounded-2xl p-4 bg-zinc-900 border border-zinc-800 flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        </div>
                        <span className="text-sm font-mono tracking-widest text-purple-400 animate-pulse">AI REASONING...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              {/* Campaign Asset Canvas */}
              {currentCampaign && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 pt-8 border-t border-zinc-800 mt-8"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Campaign Assets</h3>
                  </div>
                    
                  {/* Strategy Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                    {/* Hook Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all overflow-hidden"
                    >
                      {/* Scanline Effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">THE HOOK</span>
                          <button
                            onClick={() => copyToClipboard(currentCampaign.plan.hook, 'hook')}
                            className="p-1 hover:bg-zinc-800 rounded transition-colors"
                          >
                            {copied === 'hook' ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-zinc-500" />
                            )}
                          </button>
                        </div>
                        <p className="text-lg font-bold text-white leading-tight">{currentCampaign.plan.hook}</p>
                      </div>
                    </motion.div>

                    {/* Offer Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">THE OFFER</span>
                          <button
                            onClick={() => copyToClipboard(currentCampaign.plan.offer, 'offer')}
                            className="p-1 hover:bg-zinc-800 rounded transition-colors"
                          >
                            {copied === 'offer' ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-zinc-500" />
                            )}
                          </button>
                        </div>
                        <p className="text-base text-zinc-300 leading-tight">{currentCampaign.plan.offer}</p>
                      </div>
                    </motion.div>

                    {/* CTA Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono text-pink-400 uppercase tracking-wider">ACTION</span>
                          <button
                            onClick={() => copyToClipboard(currentCampaign.plan.cta, 'cta')}
                            className="p-1 hover:bg-zinc-800 rounded transition-colors"
                          >
                            {copied === 'cta' ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-zinc-500" />
                            )}
                          </button>
                        </div>
                        <p className="text-base text-zinc-300 leading-tight">{currentCampaign.plan.cta}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Captions Grid */}
                  {currentCampaign.captions && currentCampaign.captions.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currentCampaign.captions.map((caption, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + idx * 0.1 }}
                          className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-cyan-500/50 hover:scale-105 transition-all overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none"></div>
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">CAPTION {idx + 1}</span>
                              <button
                                onClick={() => copyToClipboard(caption, `caption-${idx}`)}
                                className="p-1 hover:bg-zinc-800 rounded transition-colors"
                              >
                                {copied === `caption-${idx}` ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4 text-zinc-500" />
                                )}
                              </button>
                            </div>
                            <p className="text-sm text-zinc-300 leading-relaxed">{caption}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Input Bar - Fixed */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800">
        <div className="p-4">
          <div className="space-y-3">
            <label className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Campaign Directive</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Enter campaign directive..."
                disabled={isGenerating}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !inputValue.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-4 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar - Desktop Only */}
      <div className="hidden lg:flex fixed bottom-0 left-0 right-0 h-[44px] z-[60] border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-xl px-6 items-center justify-between text-xs font-mono overflow-hidden">
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2 shrink-0">
            <Activity className="w-3 h-3 text-indigo-400" />
            <span className="text-zinc-500">TIER:</span>
            <span className={`font-bold ${
              systemStatus.tier === 'ACTIVE' ? 'text-green-400' :
              systemStatus.tier === 'ERROR' ? 'text-red-400' :
              systemStatus.tier.startsWith('TIER') ? 'text-yellow-400' :
              'text-zinc-400'
            }`}>
              {systemStatus.tier}
            </span>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Database className="w-3 h-3 text-purple-400" />
            <span className="text-zinc-500">DB_SYNC:</span>
            <span className={`font-bold ${
              systemStatus.dbSync === 'SYNCED' ? 'text-green-400' : 'text-zinc-400'
            }`}>
              {systemStatus.dbSync}
            </span>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Globe className="w-3 h-3 text-cyan-400" />
            <span className="text-zinc-500">REGION:</span>
            <span className="text-cyan-400 font-bold">{systemStatus.region}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <span className="text-zinc-500 whitespace-nowrap">PRACHAR.AI // ONLINE</span>
        </div>
      </div>
    </div>
  );
}
