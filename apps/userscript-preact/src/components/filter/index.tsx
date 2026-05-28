import { ComponentChildren } from "preact";
import styles from "./index.module.scss";
import { Task, TaskStatus } from "../../domains/task";
import { useComputed } from "@preact/signals";
import { manifest } from "../../signals/manifest";

const TaskStatusNames: Record<TaskStatus, string> = {
  [TaskStatus.Pending]: "等待",
  [TaskStatus.Running]: "下载",
  [TaskStatus.Failure]: "失败",
  [TaskStatus.Success]: "成功",
};

const statusList = [TaskStatus.Pending, TaskStatus.Running, TaskStatus.Success, TaskStatus.Failure];

const Filter = () => {
  const tasks = useComputed<Task[]>(() => manifest.value?.tasks || []);

  const labels: ComponentChildren[] = [];
  for (const status of statusList) {
    const name = TaskStatusNames[status];
    const amount = tasks.value.filter((task) => task.status === status).length;
    labels.push(
      <label>
        <input type="checkbox" hidden />
        <span>{name}</span>
        <span>({amount})</span>
      </label>,
    );
  }

  return <div className={styles.filter}>{labels}</div>;
};

export default Filter;
