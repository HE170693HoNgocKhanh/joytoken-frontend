import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackingService } from "../../services";

const SESSION_KEY = "activity_session_id";

const getSessionId = () => {
  if (typeof window === "undefined") return undefined;
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

const ActivityTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const sessionId = getSessionId();
    const payload = {
      sessionId,
      path: location.pathname + location.search,
      title: document.title,
      referrer: document.referrer || undefined,
      metadata: {
        hash: location.hash,
        device: navigator?.userAgentData?.platform || navigator?.platform,
        language: navigator?.language,
      },
    };

    trackingService.logActivity(payload);
  }, [location]);

  return null;
};

export default ActivityTracker;

