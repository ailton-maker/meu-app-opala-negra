import { UserProfile, Message, Conversation } from '../types';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  onSnapshot,
  serverTimestamp,
  Timestamp,
  limit
} from 'firebase/firestore';

// Perfis iniciais para o "Discovery" (Seeded profiles if none exist)
const MOCK_PROFILES: UserProfile[] = [
  {
    id: 'mock_1',
    name: 'Isabella Martins',
    age: 23,
    bio: 'Arquiteta apaixonada por café e design minimalista. Vamos conversar sobre ética e futuro?',
    location: 'São Paulo, SP',
    role: 'Creative Explorer',
    interests: ['Design', 'Arquitetura', 'Café', 'Minimalismo'],
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60',
    photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60'],
    gender: 'female',
    plan: 'gold',
    maxConversations: 30,
    currentConversations: 0,
    verificationLevel: 2,
    daysActive: 12,
    reputation: 98,
    joinedAt: new Date().toISOString()
  },
  {
    id: 'mock_2',
    name: 'Thiago Oliveira',
    age: 27,
    bio: 'Desenvolvedor focado em IA e sustentabilidade. Adoro trilhas e conversas profundas.',
    location: 'São Paulo, SP',
    role: 'Tech Ethics Lead',
    interests: ['Tecnologia', 'IA', 'Sustentabilidade', 'Trilhas'],
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60',
    photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60'],
    gender: 'male',
    plan: 'silver',
    maxConversations: 20,
    currentConversations: 0,
    verificationLevel: 2,
    daysActive: 45,
    reputation: 95,
    joinedAt: new Date().toISOString()
  },
  {
    id: 'mock_3',
    name: 'Beatriz Costa',
    age: 25,
    bio: 'Psicóloga em busca de conexões reais e diálogos conscientes.',
    location: 'Rio de Janeiro, RJ',
    role: 'Mental Health Advocate',
    interests: ['Psicologia', 'Yoga', 'Meditação', 'Conexões Reais'],
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=60',
    photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=60'],
    gender: 'female',
    plan: 'free',
    maxConversations: 5,
    currentConversations: 0,
    verificationLevel: 1,
    daysActive: 5,
    reputation: 100,
    joinedAt: new Date().toISOString()
  }
];

class FirebaseDB {
  // Profiles
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
      return null;
    }
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      const docRef = doc(db, 'users', profile.id);
      
      // Ensure invitation code exists
      const finalProfile = { ...profile };
      if (!finalProfile.invitationCode) {
        finalProfile.invitationCode = `ON-${profile.id.slice(0, 4).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
      }

      await setDoc(docRef, {
        ...finalProfile,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${profile.id}`);
    }
  }

  // Invitations
  async redeemInvitationCode(redeemerId: string, code: string) {
    try {
      const q = query(collection(db, 'users'), where('invitationCode', '==', code.toUpperCase()));
      const snap = await getDocs(q);
      
      if (snap.empty) return { success: false, message: 'Código inválido' };
      
      const inviterDoc = snap.docs[0];
      const inviterId = inviterDoc.id;
      const inviterData = inviterDoc.data() as UserProfile;

      if (inviterId === redeemerId) return { success: false, message: 'Você não pode usar seu próprio código' };

      // Reward Inviter (1 week)
      await this.addPremiumDays(inviterId, 7);
      
      // Reward Redeemer (1 week)
      await this.addPremiumDays(redeemerId, 7);

      // Mark redeemer as invited
      await updateDoc(doc(db, 'users', redeemerId), {
        invitedBy: inviterId
      });

      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'invitations');
      return { success: false, message: 'Erro ao processar convite' };
    }
  }

  private async addPremiumDays(userId: string, days: number) {
    const profile = await this.getProfile(userId);
    if (!profile) return;

    const now = new Date();
    const currentPremiumUntil = profile.premiumUntil ? new Date(profile.premiumUntil) : now;
    const baseDate = currentPremiumUntil > now ? currentPremiumUntil : now;
    const newPremiumUntil = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

    await updateDoc(doc(db, 'users', userId), {
      premiumUntil: newPremiumUntil,
      plan: 'gold'
    });
  }

  async seedInitialData() {
    try {
      const snapshot = await getDocs(query(collection(db, 'users'), limit(1)));
      if (snapshot.empty) {
        for (const profile of MOCK_PROFILES) {
          await this.saveProfile(profile);
        }
        console.log('Seeded initial profiles');
      }
    } catch (error) {
      console.error('Seed failed', error);
    }
  }

  async getAvailableProfiles(userProfile: UserProfile | null): Promise<UserProfile[]> {
    if (!userProfile) return [];
    try {
      const q = query(
        collection(db, 'users'),
        where('gender', '==', userProfile.gender === 'male' ? 'female' : 'male'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const profiles: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== userProfile.id) {
          profiles.push(doc.data() as UserProfile);
        }
      });
      return profiles;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'users');
      return [];
    }
  }

  async trackProfileView(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) return;
    try {
      const fromProfile = await this.getProfile(fromUserId);
      const isGhost = fromProfile?.isGhostMode || false;
      
      // Use a consistent ID or just add a new record
      await addDoc(collection(db, 'interactions'), {
        fromUserId,
        toUserId,
        type: 'view',
        isGhost,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      // Passive feature, silent failure
      console.error('Track profile view failed', error);
    }
  }

  // Interactions
  async likeProfile(fromUserId: string, toUserId: string) {
    try {
      const fromProfile = await this.getProfile(fromUserId);
      const isGhost = fromProfile?.isGhostMode || false;
      const interactionId = `${fromUserId}_${toUserId}`;
      await setDoc(doc(db, 'interactions', interactionId), {
        fromUserId,
        toUserId,
        type: 'like',
        isGhost,
        createdAt: serverTimestamp()
      });

      // Simple match logic: if toUser liked fromUser, create conversation
      const reverseId = `${toUserId}_${fromUserId}`;
      const reverseSnap = await getDoc(doc(db, 'interactions', reverseId));
      if (reverseSnap.exists() && reverseSnap.data().type === 'like') {
        await this.createConversation(fromUserId, toUserId);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'interactions');
    }
  }

  async passProfile(fromUserId: string, toUserId: string) {
    try {
      const fromProfile = await this.getProfile(fromUserId);
      const isGhost = fromProfile?.isGhostMode || false;
      const interactionId = `${fromUserId}_${toUserId}`;
      await setDoc(doc(db, 'interactions', interactionId), {
        fromUserId,
        toUserId,
        type: 'pass',
        isGhost,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'interactions');
    }
  }

  // Conversations
  private async createConversation(user1Id: string, user2Id: string) {
    try {
      const convId = [user1Id, user2Id].sort().join('_');
      const convRef = doc(db, 'conversations', convId);
      
      // Get profiles to embed/reference
      const p1 = await this.getProfile(user1Id);
      const p2 = await this.getProfile(user2Id);

      await setDoc(convRef, {
        participants: [user1Id, user2Id],
        updatedAt: serverTimestamp(),
        lastMessage: {
          text: 'Conexão Real Estabelecida!',
          senderId: 'system',
          timestamp: new Date().toISOString()
        }
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'conversations');
    }
  }

  subscribeToConversations(userId: string, callback: (conversations: Conversation[]) => void) {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, async (snapshot) => {
      const convPromises = snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const targetId = data.participants.find((p: string) => p !== userId);
        const targetProfile = await this.getProfile(targetId);
        
        return {
          id: docSnap.id,
          ...data,
          targetProfile: targetProfile || { name: 'Usuário Opala Negra', imageUrl: '' }
        } as Conversation;
      });

      const conversations = await Promise.all(convPromises);
      callback(conversations);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'conversations');
    });
  }

  async sendMessage(conversationId: string, text: string, senderId: string) {
    try {
      const msgRef = collection(db, 'conversations', conversationId, 'messages');
      const timestamp = new Date().toISOString();
      
      await addDoc(msgRef, {
        senderId,
        text,
        timestamp,
        status: 'sent'
      });

      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: { text, senderId, timestamp },
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `conversations/${conversationId}/messages`);
    }
  }

  subscribeToMessages(conversationId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      callback(messages);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `conversations/${conversationId}/messages`);
    });
  }

  async toggleMute(conversationId: string, currentStatus: boolean) {
    try {
      await updateDoc(doc(db, 'conversations', conversationId), {
        isMuted: !currentStatus
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `conversations/${conversationId}`);
    }
  }
  
  async setTypingStatus(conversationId: string, userId: string, isTyping: boolean) {
    try {
      await updateDoc(doc(db, 'conversations', conversationId), {
        [`typingStatus.${userId}`]: isTyping
      });
    } catch (error) {
      // Passive feature, silent failure
      console.error('Typing status update failed', error);
    }
  }

  subscribeToProfile(userId: string, callback: (profile: UserProfile | null) => void) {
    const docRef = doc(db, 'users', userId);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as UserProfile);
      } else {
        callback(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
    });
  }

  async updateGhostMode(userId: string, isGhost: boolean) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isGhostMode: isGhost
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
    }
  }

  async blockUser(userId: string, blockedUserId: string) {
    try {
      const profile = await this.getProfile(userId);
      const blockedUsers = profile?.blockedUsers || [];
      if (!blockedUsers.includes(blockedUserId)) {
        await updateDoc(doc(db, 'users', userId), {
          blockedUsers: [...blockedUsers, blockedUserId]
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
    }
  }
}

export const firebaseDb = new FirebaseDB();

// Maintain backward compatibility for components during transition
export const db_compat = {
  getAvailableProfiles: async () => {
    // This is problematic because components expect a synchronous call usually
    // But since Discovery already uses it in a useEffect/useState pattern, we can adapt it there.
    return [];
  }
};

