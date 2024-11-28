import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export function useAuth() {
  const [user, loading, error] = useAuthState(auth);
  return { user, loading, error };
}

export function useRequireAuth() {
  const { user, loading } = useAuth();
  
  if (typeof window !== 'undefined' && !loading && !user) {
    window.location.href = '/login';
  }
  
  return { user, loading };
}