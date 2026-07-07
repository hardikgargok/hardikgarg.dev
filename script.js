const entry = document.querySelector(".entry");
const page = document.querySelector(".page");
const video = document.querySelector(".background-video");
const volumeControl = document.querySelector(".volume-control");
const volume = document.querySelector(".volume");
const volumeSlider = document.querySelector(".volume-slider");
const typewriterText = document.querySelector(".typewriter-text");
const entryLetters = document.querySelector(".entry-letters");
const entryWrapper = document.querySelector(".entry-text-wrapper");
const viewCount = document.querySelector(".view-count");
let closeVolumeTimer;
let entryAnimationTimer;

const typewriterLines = [
  "Original energy. Silent moves. Hardikgarg mode.",
  "I don't play the game; I own the board.",
];

function updateViewCount() {
  if (!viewCount) return;

  const storageKey = "hardikgarg-profile-views";
  const baseViews = 1393;
  const current = Number(localStorage.getItem(storageKey) || baseViews);
  const next = current + 1;
  localStorage.setItem(storageKey, String(next));
  viewCount.textContent = next.toLocaleString("en-US");
}

updateViewCount();

if (entry && page && video) {
  entry.addEventListener("click", async () => {
    entry.classList.add("is-hidden");
    page.classList.add("is-entered");
    clearInterval(entryAnimationTimer);

    try {
      await video.play();
    } catch {
      // Some browsers block autoplay until after a user gesture; the entry click is enough in most cases.
    }
  });
}

function prepareEntryLetters() {
  if (!entryLetters) return;

  const text = entryLetters.textContent;
  entryLetters.innerHTML = text
    .split("")
    .map((char, index) => {
      const value = char === " " ? "&nbsp;" : char;
      return `<span class="entry-letter" style="--i:${index}">${value}</span>`;
    })
    .join("");
}

function playEntryAnimation() {
  if (!entry || !entryLetters || !entryWrapper) return;
  if (entry.classList.contains("is-hidden")) return;

  const width = Math.ceil(entryLetters.getBoundingClientRect().width);
  entryWrapper.style.setProperty("--entry-width", `${width}px`);
  entry.classList.remove("playing");
  void entry.offsetWidth;
  entry.classList.add("playing");
}

prepareEntryLetters();
playEntryAnimation();
if (entry) {
  entryAnimationTimer = setInterval(playEntryAnimation, 30000);
}

function syncVolumeUi() {
  if (!video || !volume || !volumeControl || !volumeSlider) return;

  const level = Number(volumeSlider.value);
  video.volume = level / 100;
  video.muted = level === 0;
  volume.classList.toggle("is-muted", video.muted);
  volume.setAttribute("aria-expanded", volumeControl.classList.contains("is-open") ? "true" : "false");
  volumeSlider.style.setProperty("--volume-level", `${level}%`);
}

if (volume && volumeControl && volumeSlider) {
  volume.addEventListener("click", (event) => {
    event.stopPropagation();
    volumeControl.classList.add("is-open");
    clearTimeout(closeVolumeTimer);
    closeVolumeTimer = setTimeout(() => {
      if (!volumeControl.matches(":hover") && document.activeElement !== volumeSlider) {
        volumeControl.classList.remove("is-open");
        syncVolumeUi();
      }
    }, 1800);
    syncVolumeUi();
  });

  volumeSlider.addEventListener("input", () => {
    volumeControl.classList.add("is-open");
    syncVolumeUi();
  });

  volumeControl.addEventListener("mouseenter", () => {
    clearTimeout(closeVolumeTimer);
    volumeControl.classList.add("is-open");
    syncVolumeUi();
  });

  volumeControl.addEventListener("mouseleave", () => {
    closeVolumeTimer = setTimeout(() => {
      if (document.activeElement !== volumeSlider) {
        volumeControl.classList.remove("is-open");
        syncVolumeUi();
      }
    }, 220);
  });

  document.addEventListener("click", (event) => {
    if (!volumeControl.contains(event.target)) {
      volumeControl.classList.remove("is-open");
      syncVolumeUi();
    }
  });
}

syncVolumeUi();

async function runTypewriter() {
  let lineIndex = 0;

  while (typewriterText) {
    const line = typewriterLines[lineIndex];

    for (let i = 1; i <= line.length; i += 1) {
      typewriterText.textContent = line.slice(0, i);
      await wait(42);
    }

    await wait(1700);

    for (let i = line.length - 1; i >= 0; i -= 1) {
      typewriterText.textContent = line.slice(0, i);
      await wait(24);
    }

    await wait(420);
    lineIndex = (lineIndex + 1) % typewriterLines.length;
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

runTypewriter();
