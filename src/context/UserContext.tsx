import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { UserProfile } from '../types';
import { db, auth } from '../services/firebase';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../services/firebase';

interface UserContextType {
  users: UserProfile[];
  loading: boolean;
  error: Error | null;
  currentUserProfile: UserProfile | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ 
  children, 
  currentUserProfile 
}: { 
  children: ReactNode; 
  currentUserProfile: UserProfile | null;
}) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Implementar verificação para que apenas usuários autenticados possam visualizar/assinar a lista
    if (!auth.currentUser || !currentUserProfile) {
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Limit to load max 150 members sequentially
    const q = query(collection(db, 'users'), limit(150));

    console.log('[UserContext] Estreitando conexão com o Firestore users...');

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const loadedUsers: UserProfile[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            
            // Requisito: Mostrar apenas usuários que tenham cadastro ativo e válido
            const hasActiveAndValidProfile = data && data.name && data.age >= 18 && data.imageUrl && data.location;
            
            if (hasActiveAndValidProfile) {
              // Requisito: Garantir que dados sensíveis (como e-mail ou senha) não sejam exibidos / vazados
              const sanitizedProfile = { ...data } as any;
              
              // Excluir de forma irredutível e explícita qualquer credencial ou PII
              delete sanitizedProfile.email;
              delete sanitizedProfile.senha;
              delete sanitizedProfile.password;
              delete sanitizedProfile.phone;
              delete sanitizedProfile.authInfo;

              loadedUsers.push(sanitizedProfile as UserProfile);
            }
          });

          // Ordenar por data de entrada mais recente (ou por nome)
          loadedUsers.sort((a, b) => {
            const dateA = a.joinedAt ? new Date(a.joinedAt).getTime() : 0;
            const dateB = b.joinedAt ? new Date(b.joinedAt).getTime() : 0;
            return dateB - dateA;
          });

          setUsers(loadedUsers);
          setLoading(false);
        } catch (err: any) {
          console.error('[UserContext] Erro ao processar snapshot:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      },
      (err) => {
        console.error('[UserContext] Falha no listener de tempo real:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
        
        // Tratamento em conformidade com as diretivas do Firebase SDK
        try {
          handleFirestoreError(err, OperationType.LIST, 'users');
        } catch (firestoreErr) {
          // Mantém o fluxo silencioso para o linter mas logado de forma limpa
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUserProfile?.id]);

  const value = useMemo(() => ({
    users,
    loading,
    error,
    currentUserProfile
  }), [users, loading, error, currentUserProfile]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers deve ser utilizado abaixo de um UserProvider');
  }
  return context;
}
