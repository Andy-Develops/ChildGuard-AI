import React, { createContext, useContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { signIn as amplifySignIn, signOut as amplifySignOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_Kedorqd0s',
      userPoolClientId: '5cucg61pqi3l37ncnblfk3k4uk',
      loginWith: {
        email: true,
      },
    },
  },
});

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      console.log('SESSION:', JSON.stringify(session)); const groups = session.tokens?.accessToken?.payload['cognito:groups'] || session.tokens?.idToken?.payload['cognito:groups'] || [];
      const role = groups.includes('Admin') || groups.includes('admin') ? 'admin' : groups.includes('law_enforcement') ? 'law_enforcement' : 'public';
      setUser({
        email: currentUser.signInDetails?.loginId || currentUser.username,
        name: currentUser.username,
        role: role,
        groups: groups,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const result = await amplifySignIn({ username: email, password });
      if (result.isSignedIn) {
        await checkUser();
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await amplifySignOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;
  const isPublic = user?.role === 'public';
  const isLawEnforcement = user?.role === 'law_enforcement' || user?.role === 'admin';
  const isAdmin = user?.groups?.includes('admin') || user?.role === 'admin';
  const canViewContactInfo = isLawEnforcement;
  const canManageCases = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        signIn,
        signOut,
        isAuthenticated,
        isPublic,
        isLawEnforcement,
        isAdmin,
        canViewContactInfo,
        canManageCases,
        isDemoMode: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
