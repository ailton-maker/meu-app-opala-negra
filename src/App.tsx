/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { View, Gender, UserProfile } from './types';
import { TopAppBar, BottomNav } from './components/Navigation';
import { Discovery } from './components/Discovery';
import { Messages, ChatView } from './components/Messages';
import { Reputation } from './components/Reputation';
import { AdminDashboard } from './components/Admin';
import { Verification } from './components/Verification';
import { ReportProfile } from './components/Report';
import { AccessFlow } from './components/AccessFlow';
import { PremiumCheckout } from './components/Checkout';
import { TransactionLedger } from './components/TransactionLedger';
import { HelpAndData } from './components/Help';
import { EditProfile } from './components/EditProfile';
import { Settings } from './components/Settings';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from './services/firebase';
import { firebaseDb } from './services/db';
import { onAuthStateChanged } from 'firebase/auth';
import { UserProvider } from './context/UserContext';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('access');
  const [previousView, setPreviousView] = useState<View>('discovery');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tempAuth, setTempAuth] = useState<{method: string, value: string} | null>(null);
  const [tempInviteCode, setTempInviteCode] = useState<string>('');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Initialize from Firebase Auth
  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    // Check for invite code in URL
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get('code') || params.get('invite');
    if (codeFromUrl) {
      setTempInviteCode(codeFromUrl);
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Seed mock profiles once we know we are authenticated!
        try {
          await firebaseDb.seedInitialData();
        } catch (e) {
          console.error("Seeding error:", e);
        }

        if (unsubscribeProfile) unsubscribeProfile();
        
        unsubscribeProfile = firebaseDb.subscribeToProfile(user.uid, (profile) => {
          if (profile) {
            setUserProfile(profile);
            setCurrentView(prev => prev === 'access' || prev === 'verification' ? 'discovery' : prev);
          } else {
            // New user authenticated but no profile yet
            setCurrentView('verification');
          }
          setLoading(false);
        });
      } else {
        if (unsubscribeProfile) unsubscribeProfile();
        setUserProfile(null);
        setCurrentView('access');
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const navigateTo = (view: View) => {
    setPreviousView(currentView);
    setCurrentView(view);
  };

  const handleBack = () => {
    navigateTo(previousView);
  };

  if (loading) {
    return (
      <div className="h-screen bg-brand-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-mango border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'discovery':
        return <Discovery userProfile={userProfile} />;
      case 'messages':
        return (
          <Messages 
            onOpenChat={(id) => {
              setActiveConversationId(id);
              navigateTo('chat_view');
            }} 
            userProfile={userProfile} 
          />
        );
      case 'chat_view':
        return (
          <ChatView 
            conversationId={activeConversationId}
            onBack={() => navigateTo('messages')} 
            userProfile={userProfile}
          />
        );
      case 'reputation':
        return <AdminDashboard />;
      case 'profile':
        return <Reputation userProfile={userProfile} onNavigate={navigateTo} />;
      case 'report':
        return <ReportProfile onBack={handleBack} />;
      case 'premium':
        return <PremiumCheckout 
          onBack={handleBack} 
          onUpgrade={(tier) => {
            const limits: Record<string, number> = { bronze: 15, silver: 25, gold: 35 };
            setUserProfile(prev => prev ? { 
              ...prev, 
              plan: tier as any, 
              maxConversations: limits[tier] || 5 
            } : null);
            handleBack();
          }} 
        />;
      case 'transactions':
        return <TransactionLedger onBack={handleBack} />;
      case 'help':
        return <HelpAndData onBack={handleBack} />;
      case 'edit_profile':
        return <EditProfile 
          onBack={handleBack} 
          onNavigate={navigateTo}
          userProfile={userProfile} 
          onUpdateProfile={(updated) => {
            setUserProfile(updated);
            firebaseDb.saveProfile(updated);
          }} 
        />;
      case 'settings':
        return (
          <Settings 
            onBack={handleBack} 
            userProfile={userProfile} 
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
          />
        );
      default:
        return <Discovery userProfile={userProfile} />;
    }
  };

  const isFullScreenView = [
    'chat_view', 
    'report', 
    'premium', 
    'transactions', 
    'access',
    'verification',
    'edit_profile',
    'settings'
  ].includes(currentView);

  const getTitle = () => {
    switch (currentView) {
      case 'discovery': return 'Descobrir';
      case 'messages': return 'Mensagens';
      case 'reputation': return 'Análise';
      case 'profile': return 'Meu Perfil';
      case 'help': return 'Ajuda & Suporte';
      default: return 'Opala Negra';
    }
  };

  return (
    <UserProvider currentUserProfile={userProfile}>
      <div className="min-h-screen bg-brand-surface flex flex-col font-sans select-none overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentView === 'access' ? (
            <AccessFlow 
              darkMode={darkMode}
              inviteCode={tempInviteCode}
              onUpdateInviteCode={setTempInviteCode}
              onComplete={(authInfo) => {
                setTempAuth({ method: authInfo.method, value: authInfo.value });
                if (authInfo.inviteCode) setTempInviteCode(authInfo.inviteCode);
                navigateTo('verification');
              }} 
            />
          ) : currentView === 'verification' ? (
            <Verification onComplete={async (gender, photos, location, video?) => {
              const userId = auth.currentUser?.uid || `user_${Date.now()}`;
              const newProfile: UserProfile = {
                id: userId,
                name: auth.currentUser?.displayName || (gender === 'female' ? "Mariana Silva" : "Gabriel Torres"),
                age: 24,
                bio: "Buscando conexões autênticas e conversas éticas.",
                location: location,
                role: gender === 'female' ? "Arquiteta" : "Design Lead",
                imageUrl: photos[0],
                photos,
                verificationVideo: video,
                gender,
                plan: 'free',
                maxConversations: 5,
                currentConversations: 0,
                verificationLevel: 1,
                daysActive: 0,
                reputation: 100,
                joinedAt: new Date().toISOString()
              };
              
              try {
                await firebaseDb.saveProfile(newProfile);
                console.log("Profile saved successfully");
                
                if (tempInviteCode) {
                  const result = await firebaseDb.redeemInvitationCode(userId, tempInviteCode);
                  if (result.success) {
                    // Re-fetch profile to get premium updates
                    const updatedProfile = await firebaseDb.getProfile(userId);
                    if (updatedProfile) setUserProfile(updatedProfile);
                    else setUserProfile(newProfile);
                  } else {
                    setUserProfile(newProfile);
                  }
                } else {
                  setUserProfile(newProfile);
                }
                
                navigateTo('discovery');
              } catch (err) {
                console.error("Failed during profile setup:", err);
                setUserProfile(newProfile);
                navigateTo('discovery');
              }
            }} />
          ) : (
            <div key="main" className="flex flex-col flex-grow">
              {!isFullScreenView && (
                <TopAppBar 
                  view={currentView} 
                  onNavigate={navigateTo} 
                  title={getTitle()}
                  showBack={currentView === 'help'}
                  onBack={() => navigateTo('profile')}
                  userProfile={userProfile}
                  darkMode={darkMode}
                  onToggleDarkMode={() => setDarkMode(!darkMode)}
                />
              )}

              <main className="flex-grow">
                {renderView()}
              </main>

              {!isFullScreenView && (
                <BottomNav activeView={currentView} onNavigate={navigateTo} userProfile={userProfile} />
              )}

              {/* Floating Action for Demo */}
              <div className="fixed top-4 left-4 z-[200] flex flex-wrap gap-2 opacity-10 hover:opacity-100 transition-opacity pointer-events-none hover:pointer-events-auto">
                <button onClick={() => navigateTo('premium')} className="bg-brand-primary text-white text-[8px] px-2 py-1 rounded">PRO</button>
                <button onClick={() => navigateTo('report')} className="bg-rose-600 text-white text-[8px] px-2 py-1 rounded">DENUNCIAR</button>
                <button onClick={() => navigateTo('transactions')} className="bg-brand-primary text-white text-[8px] px-2 py-1 rounded">TX</button>
                <button onClick={() => navigateTo('help')} className="bg-brand-primary text-white text-[8px] px-2 py-1 rounded">AJUDA</button>
                <button onClick={() => navigateTo('reputation')} className="bg-brand-primary text-white text-[8px] px-2 py-1 rounded">ADMIN</button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </UserProvider>
  );
}

