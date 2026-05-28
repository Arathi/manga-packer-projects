import { useComputed } from "@preact/signals";
import ProgressBar, { type Props } from "../progress-bar";
import { manifest } from "../../signals/manifest";
import { Task, TaskStatus } from "../../domains/task";

const TotalProgress = () => {
  const tasks = useComputed<Task[]>(() => manifest.value?.tasks || []);

  const items: Props["items"] = [];
  for (const task of tasks.value) {
    const { status = TaskStatus.Pending } = task;
    let color: string | undefined;
    switch (status) {
      case TaskStatus.Pending:
        color = "gray";
        break;
      case TaskStatus.Running:
        color = "blue";
        break;
      case TaskStatus.Failure:
        color = "red";
        break;
      case TaskStatus.Success:
        color = "green";
        break;
    }
    items.push({
      color,
      flex: 1,
    });
  }

  return <ProgressBar items={items} />;
};

export default TotalProgress;
