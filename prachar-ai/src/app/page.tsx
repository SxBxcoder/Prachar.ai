'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, LogOut, User, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { configureAuth } from '@/lib/auth';
import { isAuthenticated, getUser, logout, getAccessToken } from '@/lib/authHelpers';
import Link from 'next/link';
import CampaignDashboard from '@/components/CampaignDashboard';

export default function Home() {
  const router = useRouter();
  
  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    configureAuth();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authenticated = await isAuthenticated();
    setIsLoggedIn(authenticated);
    
    if (authenticated) {
      const user = await getUser();
      setUserEmail(user?.signInDetails?.loginId || '');
      const token = await getAccessToken();
      setAccessToken(token);
    }
    setCheckingAuth(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setUserEmail('');
    setAccessToken('');
    router.refresh();
  };



  // If user is logged in, show Director's War Room
  if (!checkingAuth && isLoggedIn) {
    return <CampaignDashboard accessToken={accessToken} userEmail={userEmail} onLogout={handleLogout} />;
  }

  // Landing Page for Non-Authenticated Users
  return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>

        <main className="max-w-4xl mx-auto px-4 py-12 relative z-10 flex flex-col items-center justify-center min-h-screen text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-mono text-gray-400">PRACHAR.AI // SYSTEM ONLINE</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                Prachar<span className="text-indigo-500">.ai</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
                The AI Creative Director for Campus & Creators
              </p>
              <p className="text-base text-gray-500 max-w-xl mx-auto">
                Generate viral Hinglish campaigns, stunning visuals, and engaging copy in seconds. Built for Indian students and creators.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                href="/register"
                className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all w-full sm:w-auto"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 fill-current" />
                  Get Started Free
                </span>
              </Link>

              <Link
                href="/login"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all w-full sm:w-auto"
              >
                Sign In
              </Link>
            </div>

            <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">AI-Powered Copy</h3>
                <p className="text-sm text-gray-400">Generate viral Hinglish captions that resonate with Indian youth</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Instant Visuals</h3>
                <p className="text-sm text-gray-400">Create stunning campaign posters in seconds with AI</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left">
                <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Complete Campaigns</h3>
                <p className="text-sm text-gray-400">Get strategy, copy, and visuals - all in one place</p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
}