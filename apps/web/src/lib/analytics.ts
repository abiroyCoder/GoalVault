import ReactGA from "react-ga4";

// Inject Microsoft Clarity Script tag
function injectClarity(projectId: string) {
  if (typeof window === "undefined" || document.getElementById("clarity-script")) return;
  
  const script = document.createElement("script");
  script.id = "clarity-script";
  script.type = "text/javascript";
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId}`;
  
  const inlineScript = document.createElement("script");
  inlineScript.type = "text/javascript";
  inlineScript.innerHTML = `
    window.clarity = window.clarity || function() { (window.clarity.q = window.clarity.q || []).push(arguments) };
  `;
  
  document.head.appendChild(inlineScript);
  document.head.appendChild(script);
}

export const analytics = {
  init: () => {
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaId) {
      try {
        ReactGA.initialize(gaId);
        console.log("[Analytics] Google Analytics initialized successfully");
      } catch (e) {
        console.warn("Failed to initialize Google Analytics:", e);
      }
    } else {
      console.log("[Analytics] Google Analytics skipped (missing VITE_GA_MEASUREMENT_ID)");
    }

    const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID;
    if (clarityId) {
      try {
        injectClarity(clarityId);
        console.log("[Analytics] Microsoft Clarity initialized successfully");
      } catch (e) {
        console.warn("Failed to initialize Microsoft Clarity:", e);
      }
    } else {
      console.log("[Analytics] Microsoft Clarity skipped (missing VITE_CLARITY_PROJECT_ID)");
    }
  },

  trackEvent: (eventName: string, params: Record<string, any> = {}) => {
    // Log locally in development
    console.log(`[Analytics Event] ${eventName}`, params);

    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaId) {
      try {
        ReactGA.event({
          category: "SkillStake",
          action: eventName,
          ...params
        });
      } catch (e) {
        // Graceful fail in case of blockers
      }
    }

    const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID;
    if (clarityId) {
      try {
        if ((window as any).clarity) {
          (window as any).clarity("event", eventName, params);
        }
      } catch (e) {
        // Graceful fail
      }
    }
  }
};
