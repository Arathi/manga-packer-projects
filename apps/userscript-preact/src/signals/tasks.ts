import { signal } from "@preact/signals";
import { Task } from "../domains/task";

export const tasks = signal<Task[]>([]);

export function update(patch: Partial<Task>) {
  const id = patch.id;
  if (id == null) {
    return;
  }

  tasks.value = tasks.value.map((task) => {
    if (task.id === id) {
      return { ...task, ...patch };
    }
    return task;
  });
}
