import { Repository } from "./repository.js";
import { Timer } from "./timer.js";
import type { Assignment, NewAssignment } from "./types.js";

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export class AssignmentStore {
  private readonly repo = new Repository<Assignment>("homework-tracker:assignments");
  private readonly timers = new Map<string, Timer>();

  getAll(): Assignment[] {
    return this.repo.getAll().sort((a, b) => a.createdAt - b.createdAt);
  }

  getPending(): Assignment[] {
    return this.getAll().filter((a) => a.status !== "complete");
  }

  getCompleted(): Assignment[] {
    return this.getAll().filter((a) => a.status === "complete");
  }

  create(input: NewAssignment): Assignment {
    const assignment: Assignment = {
      id: makeId(),
      title: input.title,
      subject: input.subject,
      expectedMinutes: input.expectedMinutes,
      actualMinutes: 0,
      status: "pending",
      createdAt: Date.now(),
      completedAt: null,
    };
    return this.repo.add(assignment);
  }

  private timerFor(id: string): Timer {
    let t = this.timers.get(id);
    if (!t) {
      t = new Timer();
      this.timers.set(id, t);
    }
    return t;
  }

  /** Press once to start the clock on an assignment. */
  startTimer(id: string): void {
    this.timerFor(id).start();
    this.repo.update(id, { status: "active" });
  }

  /**
   * Press again to stop. Adds this session's elapsed minutes onto the
   * assignment's running actualMinutes total (so pause/resume across
   * multiple sittings still adds up correctly).
   */
  stopTimer(id: string): Assignment | undefined {
    const timer = this.timerFor(id);
    const sessionMinutes = timer.stop();
    timer.reset();
    const existing = this.repo.getById(id);
    const newActual = (existing?.actualMinutes ?? 0) + sessionMinutes;
    return this.repo.update(id, { actualMinutes: newActual, status: "pending" });
  }

  isTimerRunning(id: string): boolean {
    return this.timers.get(id)?.isRunning ?? false;
  }

  liveElapsedMinutes(id: string): number {
    return this.timers.get(id)?.elapsedMinutes ?? 0;
  }

  complete(id: string): Assignment | undefined {
    if (this.isTimerRunning(id)) this.stopTimer(id);
    return this.repo.update(id, { status: "complete", completedAt: Date.now() });
  }

  remove(id: string): void {
    this.timers.delete(id);
    this.repo.remove(id);
  }
}
