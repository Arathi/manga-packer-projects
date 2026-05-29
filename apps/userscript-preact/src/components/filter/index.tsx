import { ComponentChildren } from "preact";

import { TaskStatus } from "@/domains/task";
import { tasks } from "@/signals/tasks";

import styles from "./index.module.scss";

const TaskStatusChineseNames: Record<TaskStatus, string> = {
  [TaskStatus.Pending]: "等待",
  [TaskStatus.Running]: "下载",
  [TaskStatus.Failure]: "失败",
  [TaskStatus.Success]: "成功",
};

const TaskStatusEnglishNames: Record<TaskStatus, string> = {
  [TaskStatus.Pending]: "pending",
  [TaskStatus.Running]: "running",
  [TaskStatus.Failure]: "failure",
  [TaskStatus.Success]: "success",
};

const StatusList = [
  TaskStatus.Pending,
  TaskStatus.Running,
  TaskStatus.Success,
  TaskStatus.Failure,
];

const Filter = () => {
  const labels: ComponentChildren[] = [];
  for (const status of StatusList) {
    const name = TaskStatusChineseNames[status];
    const amount = tasks.value.filter((it) => {
      const { status: s = TaskStatus.Pending } = it;
      return s === status;
    }).length;
    labels.push(
      <label className={styles[TaskStatusEnglishNames[status]]}>
        <span>{name}</span>
        <span>({amount})</span>
      </label>,
    );
  }

  return <div className={styles.filter}>{labels}</div>;
};

export default Filter;
