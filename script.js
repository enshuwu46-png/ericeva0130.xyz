const backgroundVideo = document.querySelector(".site-video-bg");
const friendshipDays = document.querySelector("[data-friendship-days]");

const dayMs = 24 * 60 * 60 * 1000;
const shanghaiOffsetMs = 8 * 60 * 60 * 1000;
const friendshipStartUtc = Date.UTC(2024, 0, 30);
const shanghaiDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

let friendshipTimer;

function getShanghaiDateParts(date = new Date()) {
  const parts = Object.fromEntries(
    shanghaiDateFormatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)])
  );

  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
  };
}

function getFriendshipDays(date = new Date()) {
  const { year, month, day } = getShanghaiDateParts(date);
  const shanghaiDateUtc = Date.UTC(year, month - 1, day);

  return Math.round((shanghaiDateUtc - friendshipStartUtc) / dayMs);
}

function getMsUntilShanghaiMidnight(date = new Date()) {
  const { year, month, day } = getShanghaiDateParts(date);
  const todayShanghaiMidnight = Date.UTC(year, month - 1, day) - shanghaiOffsetMs;

  return todayShanghaiMidnight + dayMs - date.getTime();
}

function updateFriendshipCounter() {
  if (!friendshipDays) {
    return;
  }

  friendshipDays.textContent = String(getFriendshipDays());
  window.clearTimeout(friendshipTimer);
  friendshipTimer = window.setTimeout(
    updateFriendshipCounter,
    Math.max(1000, getMsUntilShanghaiMidnight() + 200)
  );
}

function startBackgroundVideo() {
  if (!backgroundVideo) {
    return;
  }

  backgroundVideo.muted = true;
  backgroundVideo.volume = 0;
  backgroundVideo.play().catch(() => {});
}

if (backgroundVideo) {
  startBackgroundVideo();
  backgroundVideo.addEventListener("loadeddata", startBackgroundVideo, { once: true });
  backgroundVideo.addEventListener("canplay", startBackgroundVideo, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      startBackgroundVideo();
    }
  });
  window.setTimeout(startBackgroundVideo, 600);
}

updateFriendshipCounter();
