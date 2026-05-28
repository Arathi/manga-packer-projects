import { FunctionalComponent, HTMLAttributes } from "preact";
import { Task } from "../../domains/task";
import styles from "./index.module.scss";

type Props = HTMLAttributes<HTMLDivElement> & Task & {};

const TaskView: FunctionalComponent<Props> = ({ id, fileName, loaded, total }) => {
  return (
    <div className={styles["task-view"]}>
      <span>{fileName}</span>
      <meter min={0} max={total} value={loaded} style={{ flex: 1 }} />
    </div>
  );
};

export default TaskView;
