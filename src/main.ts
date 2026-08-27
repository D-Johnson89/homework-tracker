import { AssignmentStore } from "./store.js";
import { computeStats, computeVariance, formatMinutes } from "./stats.js";
import type { Assignment } from "./types.js";

const store = new AssignmentStore();

const form = document.querySelector<HTMLFormElement>("#add-form")!;
const titleInput = document.querySelector<HTMLInputElement>("#title")!;
const subjectInput = document.querySelector<HTMLInputElement>("#subject")!;
const minutesInput = document.querySelector<HTMLInputElement>("#minutes")!;
const list = document.querySelector<HTMLDivElement>("#assignment-list")!;
const emptyState = document.querySelector<HTMLDivElement>("#empty-state")!;
const statAvgDelta = document.querySelector<HTMLSpanElement>("#stat-avg-delta")!;
const statOnTime = document.querySelector<HTMLSpanElement>("#stat-on-time")!;
const statCount = document.querySelector<HTMLSpanElement>("#stat-count")!;

const RING_RADIUS = 26;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const subject = subjectInput.value.trim();
  const expectedMinutes = Number(minutesInput.value);
  if (!title || !expectedMinutes || expectedMinutes <= 0) return;

  store.create({ title, subject: subject || "General", expectedMinutes });
  form.reset();
  render();
});

list.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const card = target.closest<HTMLElement>("[data-id]");
  if (!card) return;
  const id = card.dataset.id!;

  if (target.matches("[data-action='toggle-timer']")) {
    if (store.isTimerRunning(id)) {
      store.stopTimer(id);
    } else {
      store.startTimer(id);
    }
    render();
  } else if (target.matches("[data-action='complete']")) {
    store.complete(id);
    render();
  } else if (target.matches("[data-action='remove']")) {
    store.remove(id);
    render();
  }
});

function cardTemplate(a: Assignment): string {
  const running = store.isTimerRunning(a.id);
  const liveMinutes = running ? store.liveElapsedMinutes(a.id) : a.actualMinutes;
  const progress = a.expectedMinutes > 0 ? Math.min(liveMinutes / a.expectedMinutes, 1.5) : 0;
  const overExpected = liveMinutes > a.expectedMinutes;
  const dashOffset = RING_CIRCUMFERENCE * (1 - Math.min(progress, 1));

  return `
    <article class="card ${running ? "card--active" : ""}" data-id="${a.id}">
      <div class="card__ring">
        <svg viewBox="0 0 64 64" class="ring">
          <circle class="ring__track" cx="32" cy="32" r="${RING_RADIUS}"></circle>
          <circle
            class="ring__progress ${overExpected ? "ring__progress--over" : ""}"
            cx="32" cy="32" r="${RING_RADIUS}"
            stroke-dasharray="${RING_CIRCUMFERENCE}"
            stroke-dashoffset="${dashOffset}"
          ></circle>
        </svg>
        <span class="card__minutes">${formatMinutes(liveMinutes)}</span>
      </div>
      <div class="card__body">
        <p class="card__subject">${escapeHtml(a.subject)}</p>
        <h3 class="card__title">${escapeHtml(a.title)}</h3>
        <p class="card__expected">Expected: ${formatMinutes(a.expectedMinutes)}</p>
      </div>
      <div class="card__actions">
        <button class="btn ${running ? "btn--stop" : "btn--start"}" data-action="toggle-timer">
          ${running ? "Stop" : "Start"}
        </button>
        <button class="btn btn--ghost" data-action="complete">Done</button>
        <button class="btn btn--ghost btn--danger" data-action="remove">Remove</button>
      </div>
    </article>
  `;
}

function completedRow(a: Assignment): string {
  const v = computeVariance(a);
  const sign = v.deltaMinutes > 0 ? "over" : v.deltaMinutes < 0 ? "under" : "on time";
  return `
    <li class="history__row">
      <span class="history__title">${escapeHtml(a.title)}</span>
      <span class="history__delta history__delta--${sign === "over" ? "over" : sign === "under" ? "under" : "flat"}">
        ${formatMinutes(Math.abs(v.deltaMinutes))} ${sign}
      </span>
    </li>
  `;
}

function escapeHtml(s: string): string {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function render(): void {
  const pending = store.getPending();
  const completed = store.getCompleted();
  const stats = computeStats(completed);

  list.innerHTML = pending.map(cardTemplate).join("");
  emptyState.hidden = pending.length > 0;

  statCount.textContent = String(stats.completedCount);
  statAvgDelta.textContent = stats.completedCount ? formatMinutes(stats.averageDeltaMinutes) : "—";
  statOnTime.textContent = stats.completedCount ? `${Math.round(stats.onTimeRate * 100)}%` : "—";

  const historyList = document.querySelector<HTMLUListElement>("#history-list")!;
  historyList.innerHTML = completed
    .slice()
    .reverse()
    .slice(0, 8)
    .map(completedRow)
    .join("");
}

// Tick every second so any running ring/time-elapsed label stays live.
setInterval(() => {
  if (document.querySelector(".card--active")) render();
}, 1000);

render();
