import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface FirstTimeUserState {
  hasSeenWelcome: boolean;
  hasSeenDashboardOnboarding: boolean;
  hasSeenSleepAssessment: boolean;
  hasSeenMorningAssessment: boolean;
  hasSeenCoachMarks: boolean;
  hasSeenTooltips: boolean;
  hasCompletedInitialSetup: boolean;
}

const DEFAULT_STATE: FirstTimeUserState = {
  hasSeenWelcome: false,
  hasSeenDashboardOnboarding: false,
  hasSeenSleepAssessment: false,
  hasSeenMorningAssessment: false,
  hasSeenCoachMarks: false,
  hasSeenTooltips: false,
  hasCompletedInitialSetup: false,
};

export function useFirstTimeUser() {
  const { user } = useAuth();
  const [state, setState] = useState<FirstTimeUserState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    if (!user) {
      setIsLoaded(true);
      return;
    }

    const storageKey = `firstTimeUser_${user.id}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const parsedState = JSON.parse(stored);
        setState({ ...DEFAULT_STATE, ...parsedState });
      } catch (error) {
        console.error('Error parsing first time user state:', error);
        setState(DEFAULT_STATE);
      }
    } else {
      setState(DEFAULT_STATE);
    }
    
    setIsLoaded(true);
  }, [user]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!user || !isLoaded) return;

    const storageKey = `firstTimeUser_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, user, isLoaded]);

  const markAsSeen = (key: keyof FirstTimeUserState) => {
    setState(prev => ({ ...prev, [key]: true }));
  };

  const resetAll = () => {
    setState(DEFAULT_STATE);
    if (user) {
      const storageKey = `firstTimeUser_${user.id}`;
      localStorage.removeItem(storageKey);
    }
  };

  const shouldShow = (key: keyof FirstTimeUserState): boolean => {
    if (!user || !isLoaded) return false;
    return !state[key];
  };

  // Compound checks for complex flows
  const shouldShowWelcomeFlow = (): boolean => {
    return shouldShow('hasSeenWelcome') && shouldShow('hasCompletedInitialSetup');
  };

  const shouldShowDashboardOnboarding = (): boolean => {
    return state.hasCompletedInitialSetup && shouldShow('hasSeenDashboardOnboarding');
  };

  const shouldShowCoachMarks = (): boolean => {
    return state.hasSeenDashboardOnboarding && shouldShow('hasSeenCoachMarks');
  };

  const shouldShowTooltips = (): boolean => {
    return state.hasSeenCoachMarks && shouldShow('hasSeenTooltips');
  };

  return {
    state,
    isLoaded,
    markAsSeen,
    resetAll,
    shouldShow,
    shouldShowWelcomeFlow,
    shouldShowDashboardOnboarding,
    shouldShowCoachMarks,
    shouldShowTooltips,
  };
}
