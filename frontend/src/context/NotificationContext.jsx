import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import initialNotifications from '../mock-data/notifications';

const NotificationContext = createContext(null);
const PREFS_KEY = 'gawa_notification_prefs';

const DEFAULT_PREFERENCES = {
  verification_requests: true,
  dispute_filings: true,
  appeal_filings: true,
  flagged_content: true,
  user_registrations: true,
  new_reports: true,
};

function getStoredPreferences() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : { ...DEFAULT_PREFERENCES };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [preferences, setPreferences] = useState(getStoredPreferences);

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const addNotification = useCallback((type, title, description, link) => {
    const prefMap = {
      verification_approved: 'verification_requests',
      verification_rejected: 'verification_requests',
      dispute_filed: 'dispute_filings',
      dispute_resolved: 'dispute_filings',
      appeal_forwarded: 'appeal_filings',
      appeal_decided: 'appeal_filings',
      content_flagged: 'flagged_content',
      moderation_decision: 'flagged_content',
      user_registered: 'user_registrations',
      new_report: 'new_reports',
      user_suspended: null,
      user_reinstated: null,
      points_issued: null,
      points_deducted: null,
      job_completed: null,
      user_flagged: null,
    };
    const prefKey = prefMap[type];
    if (prefKey && !preferences[prefKey]) return;

    const notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
      read: false,
      link: link || '/',
      actorName: 'System',
    };
    setNotifications((prev) => [notification, ...prev]);
  }, [preferences]);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const togglePreference = useCallback((key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        preferences,
        addNotification,
        markAsRead,
        markAllRead,
        togglePreference,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
