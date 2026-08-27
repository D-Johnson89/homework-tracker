// Core domain types. No framework — this is the "freestanding TypeScript"
// muscle the job posting is asking about: types, unions, generics, classes,
// with nothing hiding behind JSX or a component model.

export type AssignmentStatus = "pending" | "active" | "complete";

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  expectedMinutes: number;
  /** Total actual minutes spent, accumulated across timer sessions. */
  actualMinutes: number;
  status: AssignmentStatus;
  createdAt: number;
  completedAt: number | null;
}

/** Data needed to create a new assignment; the store fills in the rest. */
export type NewAssignment = Pick<Assignment, "title" | "subject" | "expectedMinutes">;

export interface VarianceResult {
  assignmentId: string;
  expectedMinutes: number;
  actualMinutes: number;
  /** actual - expected. Negative means finished early. */
  deltaMinutes: number;
  /** actual / expected. 1.0 = spot on, >1 = ran long. */
  ratio: number;
}

export interface Stats {
  completedCount: number;
  averageDeltaMinutes: number;
  averageRatio: number;
  onTimeRate: number; // fraction of assignments finished within 10% of estimate
}
