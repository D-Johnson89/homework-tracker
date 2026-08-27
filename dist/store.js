import { Repository } from "./repository.js";
import { Timer } from "./timer.js";
function makeId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
export class AssignmentStore {
    repo = new Repository("homework-tracker:assignments");
    timers = new Map();
    getAll() {
        return this.repo.getAll().sort((a, b) => a.createdAt - b.createdAt);
    }
    getPending() {
        return this.getAll().filter((a) => a.status !== "complete");
    }
    getCompleted() {
        return this.getAll().filter((a) => a.status === "complete");
    }
    create(input) {
        const assignment = {
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
    timerFor(id) {
        let t = this.timers.get(id);
        if (!t) {
            t = new Timer();
            this.timers.set(id, t);
        }
        return t;
    }
    /** Press once to start the clock on an assignment. */
    startTimer(id) {
        this.timerFor(id).start();
        this.repo.update(id, { status: "active" });
    }
    /**
     * Press again to stop. Adds this session's elapsed minutes onto the
     * assignment's running actualMinutes total (so pause/resume across
     * multiple sittings still adds up correctly).
     */
    stopTimer(id) {
        const timer = this.timerFor(id);
        const sessionMinutes = timer.stop();
        timer.reset();
        const existing = this.repo.getById(id);
        const newActual = (existing?.actualMinutes ?? 0) + sessionMinutes;
        return this.repo.update(id, { actualMinutes: newActual, status: "pending" });
    }
    isTimerRunning(id) {
        return this.timers.get(id)?.isRunning ?? false;
    }
    liveElapsedMinutes(id) {
        return this.timers.get(id)?.elapsedMinutes ?? 0;
    }
    complete(id) {
        if (this.isTimerRunning(id))
            this.stopTimer(id);
        return this.repo.update(id, { status: "complete", completedAt: Date.now() });
    }
    remove(id) {
        this.timers.delete(id);
        this.repo.remove(id);
    }
}
//# sourceMappingURL=store.js.map