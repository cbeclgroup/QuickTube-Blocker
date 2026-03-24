// Helper to match wildcard strings like r*---sn-*.googlevideo.com
const matchesWildcard = (str, rule) => {
  const escapeRegex = (s) => s.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  const regex = new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$");
  return regex.test(str);
};

const skipAds = () => {
  const video = document.querySelector('video');
  const adInterface = document.querySelector('.ad-showing, .ad-interrupting, .ytp-ad-player-overlay');
  
  // Rule for wildcard subdomain check
  const wildcardRule = "r*---sn-*.googlevideo.com";
  
  // Check if current video source matches the ad subdomain pattern
  const isAdSource = video?.src && matchesWildcard(new URL(video.src).hostname, wildcardRule);

  if ((adInterface || isAdSource) && video) {
    video.muted = true;
    video.playbackRate = 16;
    
    if (Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime = video.duration - 0.1;
    }
  }

  // Auto-click the modern skip button
  const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
  skipBtn?.click();
};

// Pulse every 400ms to stay ahead of the player
const scriptPulse = setInterval(() => {
  try {
    skipAds();
  } catch (err) {
    // Keep console quiet
  }
}, 400);