import { signal } from "@preact/signals";
import { TaskStatus } from "../domains/task";

export const filter = signal<TaskStatus[]>();
