/* ==========================================================
   SETTINGS
   ========================================================== */
const SETTINGS = {
  pageTitle: "Der Weg zum Jahreswechsel 2026/27",
  countdownEnd: "2026-12-31",
  milestonesUrl: "./data/milestones.json",
  showDaysLeft: false,
  theme: "graphite",
  showThemeSwitcher: true,
  distinguishPast: true,
  referenceDate: "today",
};

/* ==========================================================
   THEMES
   ========================================================== */
const THEMES = {
  graphite: {
    label: "Graphite",
    vars: {
      bg: "#131314",
      title: "#e8eaed",
      body: "#c9cccf",
      date: "#9aa0a6",
      marker: "#e8eaed",
      line: "#6b7075",
    },
  },
  paper: {
    label: "Paper",
    vars: {
      bg: "#faf7f2",
      title: "#1f1b16",
      body: "#4a443c",
      date: "#8a5a2b",
      marker: "#1f1b16",
      line: "#b8ad9e",
    },
  },
  coolElegance: {
    label: "Cool Elegance",
    vars: {
      bg: "#0d1b2a",
      title: "#f5fbff",
      body: "#c8d8e4",
      date: "#8ed8f8",
      marker: "#d8e2e8",
      line: "#54758a",
    },
  },
  autumn: {
    label: "Autumn",
    vars: {
      bg: "#1c1410",
      title: "#f5e6d3",
      body: "#cdb8a3",
      date: "#f59e0b",
      marker: "#e8873a",
      line: "#5a4636",
    },
  },
  classicXmas: {
    label: "Classic Xmas",
    vars: {
      bg: "#102a1d",
      title: "#fff4d6",
      body: "#eadfc5",
      date: "#d4af37",
      marker: "#c62828",
      line: "#3f6b4f",
    },
  },
  forest: {
    label: "Forest",
    vars: {
      bg: "#0e1a14",
      title: "#e6f2e9",
      body: "#a9c2b0",
      date: "#6ee7a0",
      marker: "#6ee7a0",
      line: "#2f4a3a",
    },
  },
  dusk: {
    label: "Dusk",
    vars: {
      bg: "#17111f",
      title: "#f3e8ff",
      body: "#c4b5d6",
      date: "#f472b6",
      marker: "#c084fc",
      line: "#4a3a5e",
    },
  },
  midnight: {
    label: "Midnight",
    vars: {
      bg: "#0b1120",
      title: "#e2e8f0",
      body: "#a9b6cc",
      date: "#38bdf8",
      marker: "#38bdf8",
      line: "#334155",
    },
  },
};

/* ==========================================================
   THEME ENGINE
   ========================================================== */
(function setupThemes() {
  const root = document.documentElement;
  const switcher = document.getElementById("theme-switcher");
  const STORAGE_KEY = "timeline-theme";
  const ids = Object.keys(THEMES);

  if (!ids.length) return;

  const allVars = new Set();

  ids.forEach((id) => {
    Object.keys(THEMES[id].vars).forEach((name) => allVars.add(name));
  });

  const readSaved = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  };

  const writeSaved = (id) => {
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // localStorage ist nicht verfügbar.
    }
  };

  function applyTheme(id, save = false) {
    const theme = THEMES[id];
    if (!theme) return;

    allVars.forEach((name) => {
      root.style.removeProperty(`--${name}`);
    });

    Object.entries(theme.vars).forEach(([name, value]) => {
      root.style.setProperty(`--${name}`, value);
    });

    root.dataset.theme = id;

    if (switcher) {
      switcher.querySelectorAll(".theme-swatch").forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.theme === id)
        );
      });
    }

    if (save) writeSaved(id);
  }

  if (switcher && SETTINGS.showThemeSwitcher && ids.length > 1) {
    ids.forEach((id) => {
      const { label, vars } = THEMES[id];
      const button = document.createElement("button");

      button.type = "button";
      button.className = "theme-swatch";
      button.dataset.theme = id;
      button.title = label;
      button.setAttribute("aria-label", label);
      button.setAttribute("aria-pressed", "false");
      button.style.setProperty("--swatch-bg", vars.bg);
      button.style.setProperty("--swatch-accent", vars.marker);

      button.addEventListener("click", () => {
        applyTheme(id, true);
      });

      switcher.appendChild(button);
    });

    switcher.hidden = false;
  }

  const saved = SETTINGS.showThemeSwitcher ? readSaved() : null;

  const start =
    (saved && THEMES[saved] && saved) ||
    (THEMES[SETTINGS.theme] && SETTINGS.theme) ||
    ids[0];

  applyTheme(start);
})();

/* ==========================================================
   TITLE
   ========================================================== */
(function renderTitle() {
  const heading = document.getElementById("page-title");
  if (!heading) return;

  if (SETTINGS.pageTitle) {
    heading.textContent = SETTINGS.pageTitle;
  } else {
    heading.hidden = true;
  }
})();

/* ==========================================================
   MILESTONE DATA
   ========================================================== */
async function loadMilestones() {
  const response = await fetch(SETTINGS.milestonesUrl, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Milestones konnten nicht geladen werden: HTTP ${response.status}`
    );
  }

  const milestones = await response.json();

  if (!Array.isArray(milestones)) {
    throw new TypeError(
      "milestones.json muss ein JSON-Array enthalten."
    );
  }

  return milestones;
}

/* ==========================================================
   TIMELINE RENDERING
   ========================================================== */
async function renderTimeline() {
  const list = document.getElementById("timeline");
  if (!list) return;

  const DAY_MS = 86_400_000;
  const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

  const toTime = (iso) => {
    if (typeof iso !== "string" || !ISO_DATE_PATTERN.test(iso)) {
      throw new TypeError(`Ungültiges Datum: ${String(iso)}`);
    }

    const [year, month, day] = iso.split("-").map(Number);
    const time = Date.UTC(year, month - 1, day);
    const parsed = new Date(time);

    if (
      parsed.getUTCFullYear() !== year ||
      parsed.getUTCMonth() !== month - 1 ||
      parsed.getUTCDate() !== day
    ) {
      throw new TypeError(`Ungültiges Datum: ${iso}`);
    }

    return time;
  };

  try {
    list.setAttribute("aria-busy", "true");

    const milestones = await loadMilestones();

    const validMilestones = milestones.filter((item) => {
      return (
        item &&
        typeof item.date === "string" &&
        typeof item.title === "string" &&
        typeof item.text === "string"
      );
    });

    const sorted = [...validMilestones].sort(
      (a, b) => toTime(a.date) - toTime(b.date)
    );

    const baseYear = sorted.length
      ? new Date(toTime(sorted[0].date)).getUTCFullYear()
      : null;

    const endTime = toTime(SETTINGS.countdownEnd);

    const todayTime = (() => {
      if (
        SETTINGS.referenceDate &&
        SETTINGS.referenceDate !== "today"
      ) {
        return toTime(SETTINGS.referenceDate);
      }

      const now = new Date();

      return Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
    })();

    const formatDate = (iso) => {
      const time = toTime(iso);
      const year = new Date(time).getUTCFullYear();

      const options = {
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      };

      if (year !== baseYear) {
        options.year = "numeric";
      }

      return new Intl.DateTimeFormat("de-CH", options).format(time);
    };

    const daysLeftLabel = (iso) => {
      const days = Math.round(
        (endTime - toTime(iso)) / DAY_MS
      );

      if (days <= 0) return "";

      return days === 1
        ? "1 Tag verbleibend"
        : `${days} Tage verbleibend`;
    };

    const fragment = document.createDocumentFragment();

    sorted.forEach((item) => {
      const itemTime = toTime(item.date);

      const li = document.createElement("li");
      li.className = "timeline-item";

      if (SETTINGS.distinguishPast) {
        if (itemTime === todayTime) {
          li.classList.add("is-today");
        } else if (itemTime < todayTime) {
          li.classList.add("is-past");
        }
      }

      const title = document.createElement("h3");
      title.className = "timeline-title";
      title.textContent = item.title;

      const date = document.createElement("time");
      date.className = "timeline-date";
      date.dateTime = item.date;
      date.textContent = formatDate(item.date);

      if (SETTINGS.showDaysLeft) {
        const label = daysLeftLabel(item.date);

        if (label) {
          date.textContent += ` · ${label}`;
        }
      }

      const text = document.createElement("p");
      text.className = "timeline-text";
      text.textContent = item.text;

      li.append(title, date, text);
      fragment.appendChild(li);
    });

    list.replaceChildren(fragment);
  } catch (error) {
    console.error(error);

    const message = document.createElement("li");
    message.className = "timeline-error";
    message.textContent =
      "Die Meilensteine konnten nicht geladen werden.";

    list.replaceChildren(message);
  } finally {
    list.removeAttribute("aria-busy");
  }
}

renderTimeline();
