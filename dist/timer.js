// A minimal stopwatch. In-memory only — if the son's real app grows a
// "native app" wrapper later, this is the piece that would eventually
// hand off to a background timer / DND API. For the browser MVP it just
// tracks elapsed wall-clock time between start() and stop().
export class Timer {
    startedAt = null;
    accumulatedMs = 0;
    get isRunning() {
        return this.startedAt !== null;
    }
    start() {
        if (this.isRunning)
            return;
        this.startedAt = Date.now();
    }
    /** Stops the timer and returns total elapsed minutes so far (this run). */
    stop() {
        if (this.startedAt !== null) {
            this.accumulatedMs += Date.now() - this.startedAt;
            this.startedAt = null;
        }
        return this.elapsedMinutes;
    }
    reset() {
        this.startedAt = null;
        this.accumulatedMs = 0;
    }
    get elapsedMs() {
        if (this.startedAt === null)
            return this.accumulatedMs;
        return this.accumulatedMs + (Date.now() - this.startedAt);
    }
    get elapsedMinutes() {
        return this.elapsedMs / 60000;
    }
}
//# sourceMappingURL=timer.js.map