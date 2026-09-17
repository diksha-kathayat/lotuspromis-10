const SCALES = {
  physicalFunction: [
    "Without any difficulty",
    "With a little difficulty",
    "With some difficulty",
    "With much difficulty",
    "Unable to do",
  ],
  frequency: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  intensity: ["Not at all", "A little bit", "Somewhat", "Quite a bit", "Very much"],
  sleepQuality: ["Very poor", "Poor", "Fair", "Good", "Very good"],
  socialRoles: ["Never", "Rarely", "Sometimes", "Usually", "Always"],
};

const CLUSTERS = [
  { id: "intro", name: "Getting started", surveys: ["welcome"] },
  { id: "physical", name: "Physical health", surveys: ["physical-function", "pain-intensity", "pain-interference"] },
  { id: "energy", name: "Energy & sleep", surveys: ["fatigue", "sleep-disturbance", "sleep-impairment"] },
  { id: "emotion", name: "Emotional health", surveys: ["anxiety", "depression"] },
  { id: "life", name: "Thinking & social life", surveys: ["cognitive", "social-roles"] },
];

function introHtml({ title, lead, cards, how, timeframe, tip }) {
  return `
    <div class="kicker">PROMIS short form</div>
    <h1>${title}</h1>
    <p class="lead">${lead}</p>
    ${
      cards
        ? `<div class="stat-row">${cards
            .map((c) => `<div class="stat"><b>${c.value}</b><span>${c.label}</span></div>`)
            .join("")}</div>`
        : ""
    }
    <div class="callout">
      <h2>How to answer</h2>
      <ul>${how.map((h) => `<li>${h}</li>`).join("")}</ul>
    </div>
    <div class="chip-row">${timeframe ? `<span class="time-chip">${timeframe}</span>` : ""}</div>
    ${tip ? `<div class="tip">${tip}</div>` : ""}
  `;
}

const singleQ = (title, scale) => ({ type: "single", title, scale, mandatory: true });

function domainScreens(intro, items, extra) {
  const screens = [{ type: "info", html: intro }];
  for (let i = 0; i < items.length; i += 2) {
    screens.push({ type: "questions", items: items.slice(i, i + 2) });
  }
  if (extra) screens.push({ type: "questions", items: extra });
  screens.push({ type: "milestone" });
  return screens;
}

const SURVEYS = {
  welcome: {
    title: "Welcome to LotusPROMIS-10",
    domain: false,
    screens: [
      {
        type: "info",
        html: `
          <div class="kicker">LotusLab program</div>
          <h1>Welcome to LotusPROMIS-10</h1>
          <p class="lead">A short snapshot of how you are feeling and functioning, using 10 widely used PROMIS domains.</p>
          <div class="stat-row">
            <div class="stat"><b>10 domains</b><span>Physical through social health</span></div>
            <div class="stat"><b>1–2 min</b><span>Typical time per survey</span></div>
          </div>
          <div class="callout">
            <h2>How The Guide will work</h2>
            <ul>
              <li>Surveys appear in <strong>small groups</strong>. Finish one group and the next unlocks.</li>
              <li>Each survey ends on a <strong>milestone page</strong> so you can see what is coming next.</li>
              <li>There are no right or wrong answers. Choose the option that feels closest.</li>
            </ul>
          </div>
          <div class="tip"><strong>Optional uploads</strong> on the next screens (photo, PDF) help your care team if you want to share extra context.</div>
        `,
      },
      {
        type: "questions",
        items: [
          {
            type: "single",
            title: "Are you ready to start LotusPROMIS-10?",
            options: ["Yes, let’s begin", "I understand — start when I’m ready"],
            mandatory: true,
          },
          {
            type: "text",
            title: "Anything your care team should know before you begin?",
            optional: true,
            placeholder: "Optional notes",
          },
        ],
      },
      {
        type: "questions",
        items: [
          {
            type: "photo",
            title: "Optional: a photo of a mobility aid or something you use to get around",
            optional: true,
            hint: "Take or upload a photo. Skip if this does not apply.",
          },
          {
            type: "file",
            title: "Optional: upload a recent clinic letter or summary",
            optional: true,
            hint: "PDF or image, if you have one handy.",
            accept: ".pdf,application/pdf,image/*",
          },
        ],
      },
      { type: "milestone" },
    ],
  },
  "physical-function": {
    title: "Physical Function",
    domain: true,
    screens: domainScreens(
      introHtml({
        title: "Physical Function",
        lead: "These questions ask about your ability to carry out everyday physical activities.",
        cards: [
          { value: "4 items", label: "Shown 2 per screen" },
          { value: "~1 min", label: "Typical time" },
        ],
        how: [
          "There is <strong>no 7-day time window</strong> — answer based on how you are now.",
          "If ability varies, choose the option that best matches a typical day.",
        ],
        timeframe: "No set timeframe",
        tip: "Higher ability means you can do the activity with less difficulty.",
      }),
      [
        singleQ("Are you able to do chores such as vacuuming or yard work?", "physicalFunction"),
        singleQ("Are you able to go up and down stairs at a normal pace?", "physicalFunction"),
        singleQ("Are you able to go for a walk of at least 15 minutes?", "physicalFunction"),
        singleQ("Are you able to run errands and shop?", "physicalFunction"),
      ]
    ),
  },
  "pain-intensity": {
    title: "Pain Intensity",
    domain: true,
    screens: [
      {
        type: "info",
        html: introHtml({
          title: "Pain Intensity",
          lead: "A single 0–10 rating of pain, matching the PROMIS pain intensity item used in PROMIS profile instruments.",
          cards: [
            { value: "0", label: "No pain" },
            { value: "10", label: "Worst imaginable" },
          ],
          how: [
            "Think about the <strong>past 7 days</strong>.",
            "Move the slider to the number that best matches your <em>average</em> pain.",
          ],
          timeframe: "Past 7 days",
        }),
      },
      {
        type: "questions",
        items: [
          {
            type: "slider",
            title: "In the past 7 days, how would you rate your pain on average?",
            min: 0,
            max: 10,
            minLabel: "No pain",
            maxLabel: "Worst imaginable pain",
            mandatory: true,
          },
          {
            type: "photo",
            title: "Optional: photo of a pain diary, medication, or something that helps you manage pain",
            optional: true,
            hint: "Skip if you do not want to share a photo.",
          },
        ],
      },
      { type: "milestone" },
    ],
  },
  "pain-interference": {
    title: "Pain Interference",
    domain: true,
    screens: domainScreens(
      introHtml({
        title: "Pain Interference",
        lead: "These questions ask how much pain got in the way of daily life.",
        cards: [
          { value: "4 items", label: "Day-to-day impact" },
          { value: "~1 min", label: "Typical time" },
        ],
        how: [
          "Think about the <strong>past 7 days</strong>.",
          "If you had no pain, choose <strong>Not at all</strong>.",
        ],
        timeframe: "Past 7 days",
      }),
      [
        singleQ("In the past 7 days, how much did pain interfere with your day to day activities?", "intensity"),
        singleQ("In the past 7 days, how much did pain interfere with work around the home?", "intensity"),
        singleQ("In the past 7 days, how much did pain interfere with your ability to participate in social activities?", "intensity"),
        singleQ("In the past 7 days, how much did pain interfere with your household chores?", "intensity"),
      ]
    ),
  },
  fatigue: {
    title: "Fatigue",
    domain: true,
    screens: domainScreens(
      introHtml({
        title: "Fatigue",
        lead: "These questions ask about tiredness and feeling worn out — not only sleepiness.",
        cards: [
          { value: "4 items", label: "Energy and tiredness" },
          { value: "~1 min", label: "Typical time" },
        ],
        how: [
          "Think about the <strong>past 7 days</strong>.",
          "Include both how often and how strongly fatigue showed up.",
        ],
        timeframe: "Past 7 days",
        tip: "You can optionally add a short video after these questions.",
      }),
      [
        singleQ("In the past 7 days, I feel fatigued", "intensity"),
        singleQ("In the past 7 days, I have trouble starting things because I am tired", "intensity"),
        singleQ("In the past 7 days, how run-down did you feel on average?", "intensity"),
        singleQ("In the past 7 days, how fatigued were you on average?", "intensity"),
      ],
      [
        {
          type: "video",
          title: "Optional: a short video of a moment when fatigue affected what you could do",
          optional: true,
          hint: "Record or upload a brief clip. You can skip this.",
        },
      ]
    ),
  },
  "sleep-disturbance": {
    title: "Sleep Disturbance",
    domain: true,
    screens: domainScreens(
      introHtml({
        title: "Sleep Disturbance",
        lead: "These questions ask about the <em>quality</em> of your sleep — falling asleep, staying asleep, and how refreshing sleep felt.",
        cards: [
          { value: "Night", label: "Sleep itself" },
          { value: "Next", label: "Daytime effects come later" },
        ],
        how: [
          "Think about the <strong>past 7 days</strong>.",
          "Answer about sleep itself, not how sleepy you felt during the day.",
        ],
        timeframe: "Past 7 days",
      }),
      [
        singleQ("In the past 7 days, my sleep quality was", "sleepQuality"),
        singleQ("In the past 7 days, my sleep was refreshing", "intensity"),
        singleQ("In the past 7 days, I had a problem with my sleep", "intensity"),
        singleQ("In the past 7 days, I had difficulty falling asleep", "frequency"),
      ]
    ),
  },
  "sleep-impairment": {
    title: "Sleep-Related Impairment",
    domain: true,
    screens: domainScreens(
      introHtml({
        title: "Sleep-Related Impairment",
        lead: "These questions ask how sleep (or lack of it) affected your <strong>daytime</strong> functioning.",
        cards: [
          { value: "Daytime", label: "Focus, mood, getting things done" },
          { value: "4 items", label: "Shown 2 per screen" },
        ],
        how: [
          "Think about the <strong>past 7 days</strong>.",
          "Focus on daytime effects: concentration, irritability, getting things done.",
        ],
        timeframe: "Past 7 days",
      }),
      [
        singleQ("In the past 7 days, I had a hard time getting things done because I was sleepy", "intensity"),
        singleQ("In the past 7 days, I had problems during the day because of poor sleep", "intensity"),
        singleQ("In the past 7 days, I had a hard time concentrating because of poor sleep", "intensity"),
        singleQ("In the past 7 days, I felt irritable because of poor sleep", "intensity"),
      ]
    ),
  },
  anxiety: {
    title: "Anxiety",
    domain: true,
    screens: domainScreens(
      introHtml({
        title: "Anxiety",
        lead: "These questions ask about fear, worry, and feeling on edge.",
        cards: [
          { value: "4 items", label: "Frequency in the past week" },
          { value: "~1 min", label: "Typical time" },
        ],
        how: [
          "Think about the <strong>past 7 days</strong>.",
          "Choose how often each statement was true for you.",
        ],
        timeframe: "Past 7 days",
      }),
      [
        singleQ("In the past 7 days, I felt fearful", "frequency"),
        singleQ("In the past 7 days, I found it hard to focus on anything other than my anxiety", "frequency"),
        singleQ("In the past 7 days, my worries overwhelmed me", "frequency"),
        singleQ("In the past 7 days, I felt uneasy", "frequency"),
      ]
    ),
  },
  depression: {
    title: "Depression",
    domain: true,
    screens: domainScreens(
      introHtml({
        title: "Depression",
        lead: "These questions ask about low mood, hopelessness, and feeling down.",
        cards: [
          { value: "4 items", label: "Frequency in the past week" },
          { value: "~1 min", label: "Typical time" },
        ],
        how: [
          "Think about the <strong>past 7 days</strong>.",
          "There are no right or wrong answers. If you are in distress, talk with your care team.",
        ],
        timeframe: "Past 7 days",
      }),
      [
        singleQ("In the past 7 days, I felt worthless", "frequency"),
        singleQ("In the past 7 days, I felt helpless", "frequency"),
        singleQ("In the past 7 days, I felt depressed", "frequency"),
        singleQ("In the past 7 days, I felt hopeless", "frequency"),
      ]
    ),
  },
  cognitive: {
    title: "Cognitive Function",
    domain: true,
    screens: domainScreens(
      introHtml({
        title: "Cognitive Function / Cognitive Concerns",
        lead: "These questions ask about thinking, memory, concentration, and keeping track of what you are doing.",
        cards: [
          { value: "4 items", label: "Everyday thinking" },
          { value: "~1 min", label: "Typical time" },
        ],
        how: [
          "Think about the <strong>past 7 days</strong>.",
          "Answer about everyday thinking, not a formal memory test.",
        ],
        timeframe: "Past 7 days",
      }),
      [
        singleQ("In the past 7 days, my thinking has been slow", "frequency"),
        singleQ("In the past 7 days, it has seemed like my brain was not working as well as usual", "frequency"),
        singleQ("In the past 7 days, I have had to work harder than usual to keep track of what I was doing", "frequency"),
        singleQ("In the past 7 days, I have had trouble shifting back and forth between different activities that require thinking", "frequency"),
      ]
    ),
  },
  "social-roles": {
    title: "Social Roles & Activities",
    domain: true,
    screens: domainScreens(
      introHtml({
        title: "Ability to Participate in Social Roles &amp; Activities",
        lead: "These questions ask whether you could take part in family, work, leisure, and time with friends.",
        cards: [
          { value: "Last domain", label: "In LotusPROMIS-10" },
          { value: "4 items", label: "Shown 2 per screen" },
        ],
        how: [
          "Think about the <strong>past 7 days</strong>.",
          "<strong>Never</strong> having trouble means you could do these activities as you wanted.",
        ],
        timeframe: "Past 7 days",
      }),
      [
        singleQ("I have trouble doing all of my regular leisure activities with others", "socialRoles"),
        singleQ("I have trouble doing all of the family activities that I want to do", "socialRoles"),
        singleQ("I have trouble doing all of my usual work (include work at home)", "socialRoles"),
        singleQ("I have trouble doing all of the activities with friends that I want to do", "socialRoles"),
      ]
    ),
  },
};

const KEY = "lotuspromis10-state-v2";
const DOMAIN_IDS = Object.keys(SURVEYS).filter((id) => SURVEYS[id].domain);

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { completed: {}, progress: {} };
  } catch {
    return { completed: {}, progress: {} };
  }
}

function saveState() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

let state = loadState();
let qId = null;
let qStep = 0;
let qViewOnly = false;
let qAnswers = {};

function go(name) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
  document.getElementById("screen-" + name).classList.add("active");
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}

function formatDisplay(iso) {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n) => String(n).padStart(2, "0");
  const h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${hr}:${pad(d.getMinutes())} ${ampm}`;
}

function isDone(id) {
  return Boolean(state.completed[id]);
}

function clusterComplete(cluster, extraId) {
  return cluster.surveys.every((id) => isDone(id) || id === extraId);
}

function activeCluster(extraId) {
  return CLUSTERS.find((c) => !clusterComplete(c, extraId)) || null;
}

function notesIcon() {
  return `<svg width="20" height="22" viewBox="0 0 16 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13 0C14.6545 0 16 1.34472 16 2.99825V15.0017C16 16.6548 14.6545 18 13 18H3C1.3455 18 0 16.6548 0 15.0017V2.99825C0 1.34472 1.3455 0 3 0H13ZM9 11.9943H4V13.9931H9V11.9943ZM12 7.99509H4V9.99392H12V7.99509ZM12 3.99742H4V5.99625H12V3.99742Z"/></svg>`;
}

function checkIcon() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 9.5 17 19 7"/></svg>`;
}

function renderHome() {
  const pending = document.getElementById("pendingMount");
  const completed = document.getElementById("completedMount");
  const current = activeCluster();

  if (!current) {
    pending.innerHTML = `<div class="empty">You’re all caught up.<br/>LotusPROMIS-10 is complete.</div>`;
  } else {
    const remaining = current.surveys.filter((id) => !isDone(id));
    pending.innerHTML = `<ul class="task-list">${remaining
      .map((id) => {
        const inProgress = state.progress[id];
        return `<li>
          <div class="chip notes">${notesIcon()}</div>
          <div class="task-copy"><h3>${SURVEYS[id].title}</h3></div>
          <button class="pill ${inProgress ? "" : "start"}" data-open="${id}">${inProgress ? "Continue" : "Start"}</button>
        </li>`;
      })
      .join("")}</ul>`;
  }

  const doneIds = Object.keys(state.completed).sort((a, b) => {
    const ta = new Date(state.completed[a].at).getTime();
    const tb = new Date(state.completed[b].at).getTime();
    if (Number.isNaN(ta) || Number.isNaN(tb)) return 0;
    return tb - ta;
  });
  if (!doneIds.length) {
    completed.innerHTML = "";
  } else {
    completed.innerHTML = `<ul class="task-list">${doneIds
      .map(
        (id) => `<li>
          <div class="chip ok">${checkIcon()}</div>
          <div class="task-copy">
            <h3>${SURVEYS[id].title}</h3>
            <p>${formatDisplay(state.completed[id].at)}</p>
          </div>
          <button class="pill" data-view="${id}">View</button>
        </li>`
      )
      .join("")}</ul>`;
  }

  pending.querySelectorAll("[data-open]").forEach((btn) =>
    btn.addEventListener("click", () => openForm(btn.dataset.open, false))
  );
  completed.querySelectorAll("[data-view]").forEach((btn) =>
    btn.addEventListener("click", () => openForm(btn.dataset.view, true))
  );
}

function screens() {
  return SURVEYS[qId].screens;
}

function currentScreen() {
  return screens()[qStep];
}

function answerKey(itemIndex) {
  return `${qStep}:${itemIndex}`;
}

function openForm(id, viewOnly) {
  qId = id;
  qViewOnly = viewOnly;
  qAnswers = viewOnly ? { ...(state.completed[id]?.answers || {}) } : { ...(state.progress[id]?.answers || {}) };
  qStep = viewOnly ? 0 : state.progress[id]?.step || 0;
  document.getElementById("qFormTitle").textContent = SURVEYS[id].title;
  go("questionnaire");
  renderScreen();
}

function persistProgress() {
  if (qViewOnly) return;
  state.progress[qId] = { step: qStep, answers: qAnswers };
  saveState();
}

function optionsFor(item) {
  return item.options || SCALES[item.scale] || [];
}

function isAnswered(item, key) {
  const val = qAnswers[key];
  if (item.type === "text") return true;
  if (item.optional) return true;
  if (item.type === "slider") return val !== undefined && val !== null && val !== "";
  if (item.type === "photo" || item.type === "video" || item.type === "file") return true;
  return val !== undefined && val !== null && val !== "";
}

function canAdvance() {
  const screen = currentScreen();
  if (qViewOnly || screen.type === "info" || screen.type === "milestone") return true;
  return screen.items.every((item, i) => isAnswered(item, answerKey(i)));
}

function renderChoices(item, key) {
  const wrap = document.createElement("div");
  wrap.className = "choices";
  optionsFor(item).forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice" + (qAnswers[key] === i ? " selected" : "");
    btn.innerHTML = `<span class="radio"></span><span>${opt}</span>`;
    if (!qViewOnly) {
      btn.addEventListener("click", () => {
        qAnswers[key] = i;
        persistProgress();
        renderScreen();
      });
    }
    wrap.appendChild(btn);
  });
  return wrap;
}

function renderSlider(item, key) {
  const val = qAnswers[key] ?? 0;
  const card = document.createElement("div");
  card.className = "slider-card";
  card.innerHTML = `
    <div class="slider-value">${val}</div>
    <input type="range" min="${item.min}" max="${item.max}" step="1" value="${val}" ${qViewOnly ? "disabled" : ""} />
    <div class="slider-labels"><span>${item.minLabel}</span><span>${item.maxLabel}</span></div>`;
  const input = card.querySelector("input");
  qAnswers[key] = Number(input.value);
  input.addEventListener("input", () => {
    qAnswers[key] = Number(input.value);
    card.querySelector(".slider-value").textContent = input.value;
    persistProgress();
  });
  return card;
}

function renderText(item, key) {
  const ta = document.createElement("textarea");
  ta.className = "text-area";
  ta.placeholder = item.placeholder || "";
  ta.value = qAnswers[key] || "";
  ta.disabled = qViewOnly;
  ta.addEventListener("input", () => {
    qAnswers[key] = ta.value;
    persistProgress();
  });
  return ta;
}

function renderUpload(item, key, kind) {
  const current = qAnswers[key];
  const card = document.createElement("div");
  card.className = "upload-card";
  const input = document.createElement("input");
  input.type = "file";
  input.hidden = true;
  input.accept = item.accept || (kind === "photo" ? "image/*" : kind === "video" ? "video/*" : ".pdf,application/pdf,image/*");
  if (!qViewOnly) {
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        qAnswers[key] = { name: file.name, type: file.type, dataUrl: reader.result };
        persistProgress();
        renderScreen();
      };
      reader.readAsDataURL(file);
    });
  }

  let preview = "";
  if (current?.dataUrl && (current.type || "").startsWith("image/")) {
    preview = `<img class="preview-img" alt="" src="${current.dataUrl}" />`;
  } else if (current?.dataUrl && (current.type || "").startsWith("video/")) {
    preview = `<video class="preview-video" src="${current.dataUrl}" controls></video>`;
  } else if (current?.name) {
    preview = `<p class="file-name">${current.name}</p>`;
  }

  const label =
    kind === "photo" ? "Take or upload photo" : kind === "video" ? "Record or upload video" : "Upload PDF or image";
  card.innerHTML = `${preview}<p>${item.hint || ""}</p>`;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn primary";
  btn.style.height = "44px";
  btn.style.width = "100%";
  btn.style.margin = "0";
  btn.textContent = current ? "Replace" : label;
  btn.disabled = qViewOnly;
  btn.addEventListener("click", () => input.click());
  card.appendChild(btn);
  card.appendChild(input);
  return card;
}

function itemBlock(item, index) {
  const key = answerKey(index);
  const block = document.createElement("section");
  block.className = "q-item";
  const title = document.createElement("h2");
  title.className = "q-title";
  title.innerHTML = `${item.title}${item.optional ? '<span class="optional-tag">Optional</span>' : ""}`;
  block.appendChild(title);
  if (item.type === "single") block.appendChild(renderChoices(item, key));
  else if (item.type === "slider") block.appendChild(renderSlider(item, key));
  else if (item.type === "text") block.appendChild(renderText(item, key));
  else if (item.type === "photo") block.appendChild(renderUpload(item, key, "photo"));
  else if (item.type === "video") block.appendChild(renderUpload(item, key, "video"));
  else if (item.type === "file") block.appendChild(renderUpload(item, key, "file"));
  return block;
}

function domainCount(includeCurrent) {
  const extra = includeCurrent && SURVEYS[qId]?.domain && !isDone(qId) ? 1 : 0;
  return DOMAIN_IDS.filter(isDone).length + extra;
}

function upcomingSurveys(fromId, treatDone) {
  const ids = CLUSTERS.flatMap((c) => c.surveys);
  return ids.filter((id) => id !== fromId && !(isDone(id) || (treatDone && id === fromId))).slice(0, 3);
}

function renderMilestoneBody() {
  const treatDone = !qViewOnly;
  const just = SURVEYS[qId];
  const doneDomains = domainCount(treatDone);
  const current = activeCluster(treatDone ? qId : null);
  const pct = Math.round((doneDomains / 10) * 100);
  const next = upcomingSurveys(qId, treatDone);
  const clusterNow = CLUSTERS.find((c) => c.surveys.includes(qId));
  const clusterJustClosed = clusterNow && clusterComplete(clusterNow, treatDone ? qId : null);
  const allDone = !current;

  const stepsHtml = CLUSTERS.map((c) => {
    const status = clusterComplete(c, treatDone ? qId : null) ? "done" : current && current.id === c.id ? "now" : "";
    const label = clusterComplete(c, treatDone ? qId : null)
      ? "Complete"
      : current && current.id === c.id
        ? "In progress"
        : "Coming up";
    return `<div class="step"><div class="dot ${status}"></div><div><strong>${c.name}</strong><span>${label}</span></div></div>`;
  }).join("");

  const nextHtml = allDone
    ? `<div class="next-card"><b>All 10 PROMIS domains complete</b><small>Your Guide is clear until the next scheduled check-in.</small></div>`
    : next
        .map((id) => {
          const cluster = CLUSTERS.find((c) => c.surveys.includes(id));
          return `<div class="next-card"><b>${SURVEYS[id].title}</b><small>Coming up in ${cluster.name}</small></div>`;
        })
        .join("");

  const wrap = document.createElement("div");
  wrap.className = "html-block";
  wrap.innerHTML = `
    <div class="kicker">${clusterJustClosed ? clusterNow.name + " complete" : "Milestone"}</div>
    <h1>${allDone ? "LotusPROMIS-10 complete" : "Nice work"}</h1>
    <p class="lead">You reached the end of <strong>${just.title}</strong>.${
      clusterJustClosed && current ? ` Next on The Guide: ${current.name}.` : ""
    }</p>
    <div class="ring-wrap">
      <svg class="ring" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r="34" fill="none" stroke="#e2e8f0" stroke-width="8"/>
        <circle cx="42" cy="42" r="34" fill="none" stroke="#008294" stroke-width="8"
          stroke-linecap="round" transform="rotate(-90 42 42)"
          stroke-dasharray="${2 * Math.PI * 34}" stroke-dashoffset="${2 * Math.PI * 34 * (1 - doneDomains / 10)}"/>
        <text x="42" y="46" text-anchor="middle" font-size="16" font-weight="700" fill="#3d2c73">${doneDomains}/10</text>
      </svg>
      <div>
        <strong>${doneDomains === 0 ? "10 domains ahead" : pct + "% of PROMIS domains"}</strong>
        <p class="cluster-blurb" style="margin:4px 0 0">This last page shows where you are and what is coming next. Press Finish to save and return to The Guide.</p>
      </div>
    </div>
    <div class="kicker">Your path</div>
    <div class="steps">${stepsHtml}</div>
    <div class="kicker">${allDone ? "What’s next" : "Coming up"}</div>
    ${nextHtml}
  `;
  return wrap;
}

function renderScreen() {
  const form = SURVEYS[qId];
  const screen = currentScreen();
  const total = form.screens.length;
  document.getElementById("qProgressBar").style.width = Math.round(((qStep + 1) / total) * 100) + "%";
  document.getElementById("qStepLabel").textContent = `${qStep + 1} of ${total}`;
  const titleEl = document.getElementById("qQuestionTitle");
  titleEl.style.display = "none";
  const body = document.getElementById("qBody");
  body.innerHTML = "";

  if (screen.type === "info") {
    const wrap = document.createElement("div");
    wrap.className = "html-block";
    wrap.innerHTML = screen.html;
    body.appendChild(wrap);
  } else if (screen.type === "questions") {
    screen.items.forEach((item, i) => body.appendChild(itemBlock(item, i)));
  } else if (screen.type === "milestone") {
    body.appendChild(renderMilestoneBody());
  }

  const isFirst = qStep === 0;
  const isLast = qStep === total - 1;
  document.getElementById("qPrev").hidden = isFirst;
  document.getElementById("qNext").hidden = isLast;
  document.getElementById("qFinish").hidden = !isLast;
  document.getElementById("qFinish").textContent = qViewOnly ? "Done" : "Finish";
  document.getElementById("qNext").disabled = !canAdvance();
  document.getElementById("qFinish").disabled = !canAdvance();
}

function finishForm() {
  if (qViewOnly) {
    go("home");
    renderHome();
    return;
  }
  state.completed[qId] = { at: new Date().toISOString(), answers: qAnswers };
  delete state.progress[qId];
  saveState();
  go("home");
  renderHome();
}

const TAB_ICONS = {
  home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"/></svg>',
  info: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M2 12C2 6.473 6.473 2 12 2s10 4.473 10 10-4.473 10-10 10S2 17.527 2 12zm2 0c0 4.663 3.336 8 8 8 4.663 0 8-3.336 8-8 0-4.663-3.336-8-8-8-4.663 0-8 3.336-8 8zm6.5-3.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM11 12a1 1 0 112 0v4a1 1 0 11-2 0v-4z"/></svg>',
  settings:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1-.1a1.7 1.7 0 0 0-.3 1.8V9c.2.6.8 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>',
};

function tabbarHtml(active) {
  return ["home", "info", "settings"]
    .map((id) => {
      const label = id === "home" ? "The Guide" : id === "info" ? "Information" : "Settings";
      return `<button class="tab${active === id ? " active" : ""}" data-tab="${id}">${TAB_ICONS[id]}${label}</button>`;
    })
    .join("");
}

document.querySelectorAll("[data-tabbar]").forEach((el) => {
  el.innerHTML = tabbarHtml(el.dataset.tabbar);
});

document.body.addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  go(tab.dataset.tab);
});

const FAQS = [
  {
    q: "What is PROMIS?",
    a: "<p>PROMIS (Patient-Reported Outcomes Measurement Information System) is a set of short, validated questionnaires about how you feel and function. LotusPROMIS-10 uses 10 commonly used domains.</p>",
  },
  {
    q: "Which domains are included?",
    a: "<p>Physical Function, Pain Intensity, Pain Interference, Fatigue, Sleep Disturbance, Sleep-Related Impairment, Anxiety, Depression, Cognitive Function, and Ability to Participate in Social Roles &amp; Activities.</p>",
  },
  {
    q: "Why do surveys unlock in groups?",
    a: "<p>The Guide only shows the next group once you finish the current one — for example physical health, then energy and sleep. That matches how LotusLab schedules activities, rather than listing everything at once.</p>",
  },
  {
    q: "How long does each survey take?",
    a: "<p>Most domains are 4 short items and take about 1–2 minutes. You will see 2 questions on a screen. Optional photo, video, or PDF uploads can be skipped.</p>",
  },
  {
    q: "What is the milestone page?",
    a: "<p>The last page of each survey is a milestone. It shows how many of the 10 domains you have finished and which surveys are coming next. Press <strong>Finish</strong> to save and return to The Guide.</p>",
  },
  {
    q: "Who sees my answers?",
    a: "<p>Your responses are for your LotusLab care team. Uploads such as a clinic letter or photo are optional and only shared if you add them.</p>",
  },
  {
    q: "What if I feel distressed?",
    a: "<p>There are no right or wrong answers. If the emotional health questions are upsetting, pause and talk with your care team, or use your usual support contacts.</p>",
  },
];

function renderFaqs() {
  const mount = document.getElementById("faqMount");
  if (!mount) return;
  mount.innerHTML = FAQS.map(
    (item, i) => `
      <article class="faq" data-faq="${i}">
        <button type="button" class="faq-q">${item.q}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </button>
        <div class="faq-a">${item.a}</div>
      </article>`
  ).join("");
  mount.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => btn.parentElement.classList.toggle("open"));
  });
}

document.getElementById("qExit").addEventListener("click", () => {
  persistProgress();
  go("home");
  renderHome();
});
document.getElementById("qPrev").addEventListener("click", () => {
  if (qStep > 0) {
    qStep -= 1;
    persistProgress();
    renderScreen();
  }
});
document.getElementById("qNext").addEventListener("click", () => {
  if (!canAdvance()) return;
  qStep += 1;
  persistProgress();
  renderScreen();
});
document.getElementById("qFinish").addEventListener("click", finishForm);
document.getElementById("resetBtn").addEventListener("click", () => {
  state = { completed: {}, progress: {} };
  saveState();
  toast("Demo reset");
  go("home");
  renderHome();
});
document.getElementById("joinLink").addEventListener("click", (e) => {
  e.preventDefault();
  toast("Join additional program is available in the live LotusLab app.");
});

const now = new Date();
document.getElementById("todayLabel").textContent = `Today ${String(now.getDate()).padStart(2, "0")}/${String(
  now.getMonth() + 1
).padStart(2, "0")}/${now.getFullYear()}`;

renderFaqs();
renderHome();
