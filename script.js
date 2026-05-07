const portfolioData = {
  role: "Just some guy on the internet",
  name: "Iunno",
  tagline: "I am Iunno.",
  about:
    "I help run a Discord community.",
  discord: "https://discord.com/users/1391397301490155571",
  invite: "https://discord.gg/StUpwFeyQZ",
  github: "https://github.com/coolguy-cmyk",
  projects: [
    {
      title: "rebackofficial",
      description: "Official website for our Discord server.",
      liveUrl: "https://rebackofficial.netlify.app",
      codeUrl: "",
    },
  ],
};

function fillText() {
  document.getElementById("role").textContent = portfolioData.role;
  document.getElementById("name").textContent = portfolioData.name;
  document.getElementById("tagline").textContent = portfolioData.tagline;
  document.getElementById("aboutText").textContent = portfolioData.about;
  document.getElementById("footerName").textContent = portfolioData.name;
}

function fillLinks() {
  const discordLink = document.getElementById("discordLink");
  discordLink.href = portfolioData.invite;
  discordLink.textContent = "Join our Discord";

  const githubLink = document.getElementById("githubLink");
  githubLink.href = portfolioData.github;
  githubLink.textContent = "GitHub";
}

function fillProjects() {
  const projectList = document.getElementById("projectList");
  portfolioData.projects.forEach((project) => {
    const article = document.createElement("article");
    article.className = "project";
    const codeLink = project.codeUrl
      ? `<a href="${project.codeUrl}" target="_blank" rel="noreferrer">Source Code</a>`
      : `<span>Source code: private</span>`;
    article.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <a href="${project.liveUrl}" target="_blank" rel="noreferrer">Link</a> ·
      ${codeLink}
    `;
    projectList.appendChild(article);
  });
}

function fillClock() {
  const clockText = document.getElementById("clockText");
  const render = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    clockText.textContent = `Current time: ${formatter.format(now)}`;
  };
  render();
  setInterval(render, 1000);
}

function fillYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

function setupMusic() {
  const musicToggle = document.getElementById("musicToggle");
  const audio = new Audio(
    "https://cdn.pixabay.com/download/audio/2023/05/31/audio_886f1c67f0.mp3?filename=lofi-study-112191.mp3"
  );
  audio.loop = true;
  audio.volume = 0.35;

  let isPlaying = false;
  let audioContext;
  let synthNodes = null;

  function startSynthLofi() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    if (synthNodes) {
      return;
    }

    const master = audioContext.createGain();
    master.gain.value = 0.06;
    master.connect(audioContext.destination);

    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 1100;
    lowpass.Q.value = 0.7;
    lowpass.connect(master);

    const pad = audioContext.createOscillator();
    const padGain = audioContext.createGain();
    pad.type = "triangle";
    pad.frequency.value = 220;
    padGain.gain.value = 0.03;
    pad.connect(padGain);
    padGain.connect(lowpass);
    pad.start();

    const bass = audioContext.createOscillator();
    const bassGain = audioContext.createGain();
    bass.type = "sine";
    bass.frequency.value = 55;
    bassGain.gain.value = 0.06;
    bass.connect(bassGain);
    bassGain.connect(lowpass);
    bass.start();

    synthNodes = { pad, bass, master };
  }

  function stopSynthLofi() {
    if (!synthNodes) {
      return;
    }
    synthNodes.pad.stop();
    synthNodes.bass.stop();
    synthNodes.master.disconnect();
    synthNodes = null;
  }

  async function startRealAudioWithFallback() {
    try {
      const before = audio.currentTime;
      await audio.play();
      // Some browsers resolve play() even when stream is not really audible yet.
      setTimeout(() => {
        const progressed = audio.currentTime > before + 0.05;
        if (!progressed) {
          audio.pause();
          startSynthLofi();
        }
        isPlaying = true;
        musicToggle.textContent = "Pause lo-fi";
      }, 1800);
    } catch (_error) {
      startSynthLofi();
      isPlaying = true;
      musicToggle.textContent = "Pause lo-fi";
    }
  }

  async function tryAutoplay() {
    await startRealAudioWithFallback();
  }

  musicToggle.addEventListener("click", async () => {
    if (!isPlaying) {
      await startRealAudioWithFallback();
      return;
    }

    audio.pause();
    stopSynthLofi();
    isPlaying = false;
    musicToggle.textContent = "Play lo-fi";
  });

  tryAutoplay();

  const retryAutoplayOnInteraction = async () => {
    if (isPlaying) {
      return;
    }
    await startRealAudioWithFallback();
  };

  window.addEventListener("pointerdown", retryAutoplayOnInteraction, {
    once: true,
  });
}

function setupCursorEffects() {
  const cursorDot = document.getElementById("cursorDot");
  let lastTrailTime = 0;

  document.addEventListener("mousemove", (event) => {
    const x = event.clientX;
    const y = event.clientY;
    cursorDot.style.left = `${x}px`;
    cursorDot.style.top = `${y}px`;

    const now = performance.now();
    if (now - lastTrailTime < 22) {
      return;
    }
    lastTrailTime = now;

    const trail = document.createElement("span");
    trail.className = "cursor-trail";
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 700);
  });
}

function setupSnow() {
  const canvas = document.getElementById("snowCanvas");
  const ctx = canvas.getContext("2d");

  const snowflakes = [];
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const flakeCount = 140;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createSnowflakes() {
    snowflakes.length = 0;
    for (let i = 0; i < flakeCount; i += 1) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.6 + 1,
        baseVy: Math.random() * 0.7 + 0.25,
        vy: Math.random() * 0.7 + 0.25,
        vx: (Math.random() - 0.5) * 0.4,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";

    snowflakes.forEach((flake) => {
      const dx = mouse.x - flake.x;
      const dy = mouse.y - flake.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const pull = Math.min(2.4 / distance, 0.03);

      // Stronger global attraction so movement visibly follows the cursor.
      flake.vx += (dx / distance) * pull;
      flake.vy += (dy / distance) * pull * 0.45;
      flake.vx *= 0.986;
      flake.vy = flake.vy * 0.97 + flake.baseVy * 0.03;
      flake.vy = Math.min(2.4, Math.max(0.08, flake.vy));

      flake.x += flake.vx;
      flake.y += flake.vy;

      if (flake.y > canvas.height + 10) {
        flake.y = -10;
        flake.x = Math.random() * canvas.width;
      }
      if (flake.x < -10) flake.x = canvas.width + 10;
      if (flake.x > canvas.width + 10) flake.x = -10;

      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    createSnowflakes();
  });

  document.addEventListener("pointermove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  resizeCanvas();
  createSnowflakes();
  draw();
}

fillText();
fillLinks();
fillProjects();
fillClock();
fillYear();
setupMusic();
setupCursorEffects();
setupSnow();
