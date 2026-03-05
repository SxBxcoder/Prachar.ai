'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Terminal, Activity, Database, Globe, Copy, Check, Zap, LogOut } from 'lucide-react';

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
    // Try to parse the entire text as JSON first
    const parsed = JSON.parse(text);
    
    // Check if it has the campaign structure
    if (parsed.hook || parsed.plan || parsed.captions) {
      const campaign: CampaignData = {
        plan: parsed.plan || {
          hook: parsed.hook || '',
          offer: parsed.offer || '',
          cta: parsed.cta || ''
        },
        captions: parsed.captions || [],
        image_url: parsed.image_url || parsed.imageUrl,
        campaignId: parsed.campaignId,
        status: parsed.status
      };
      
      return {
        campaign,
        displayMessage: '✅ Strategic Campaign Compiled. See the Canvas below.'
      };
    }
  } catch (e) {
    // Not valid JSON, try to find JSON within the text using regex
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        
        if (parsed.hook || parsed.plan || parsed.captions) {
          const campaign: CampaignData = {
            plan: parsed.plan || {
              hook: parsed.hook || '',
              offer: parsed.offer || '',
              cta: parsed.cta || ''
            },
            captions: parsed.captions || [],
            image_url: parsed.image_url || parsed.imageUrl,
            campaignId: parsed.campaignId,
            status: parsed.status
          };
          
          return {
            campaign,
            displayMessage: '✅ Strategic Campaign Compiled. See the Canvas below.'
          };
        }
      } catch (e2) {
        // Nested JSON parse failed
      }
    }
  }
  
  // No valid campaign JSON found, return text as-is
  return {
    campaign: null,
    displayMessage: text
  };
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

      {/* Main Split-Pane Layout */}
      <div className="flex-1 flex relative z-10">
        
        {/* LEFT SIDEBAR - INPUT ONLY (Fixed 400px) */}
        <div className="w-[400px] border-r border-zinc-800 flex flex-col bg-zinc-900/50 backdrop-blur-xl">
          
          {/* Sidebar Header */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-mono font-bold text-white">DIRECTOR'S TERMINAL</h2>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-red-400"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-zinc-500 font-mono">{userEmail}</p>
          </div>

          {/* Spacer */}
          <div className="flex-1 flex items-center justify-center p-6">
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

          {/* Input Area */}
          <div className="p-4 border-t border-zinc-800">
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
              {isGenerating && (
                <div className="flex items-center gap-2 text-purple-400 text-xs">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                  <span className="font-mono">AI REASONING...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CENTER CANVAS - ACTIVE INTELLIGENCE FEED (Fluid) */}
        <div className="flex-1 overflow-y-auto">
          
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 p-8">
              <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 opacity-30" />
              </div>
              <p className="text-sm font-mono">AWAITING DIRECTIVE...</p>
              <p className="text-xs text-zinc-700 mt-2">Enter a campaign goal to begin</p>
            </div>
          ) : (
            <div className="p-8 space-y-8">
              
              {/* Active Intelligence Feed - Chat History */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Active Intelligence Feed</h3>
                </div>
                
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl p-4 ${
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
                  </AnimatePresence>
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Campaign Asset Canvas */}
              {currentCampaign && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 pt-8 border-t border-zinc-800"
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

                  {/* Visual Asset */}
                  {currentCampaign.image_url && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="group relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 hover:border-indigo-500/50 transition-all"
                    >
                      <img
                        src={currentCampaign.image_url}
                        alt="Campaign Visual"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur text-xs font-mono text-indigo-300 border border-indigo-500/30">
                          VISUAL ASSET
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between text-xs font-mono relative z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
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
          
          <div className="flex items-center gap-2">
            <Database className="w-3 h-3 text-purple-400" />
            <span className="text-zinc-500">DB_SYNC:</span>
            <span className={`font-bold ${
              systemStatus.dbSync === 'SYNCED' ? 'text-green-400' : 'text-zinc-400'
            }`}>
              {systemStatus.dbSync}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3 text-cyan-400" />
            <span className="text-zinc-500">REGION:</span>
            <span className="text-cyan-400 font-bold">{systemStatus.region}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <span className="text-zinc-500">PRACHAR.AI // ONLINE</span>
        </div>
      </div>
    </div>
  );
}
