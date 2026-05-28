import { ComponentChildren } from "preact";
import styles from "./index.module.scss";

export type Props = {
  type?: "progress" | "meter";
  value?: number;
  min?: number;
  max?: number;
  items?: Item[];
};

type Item = {
  color?: string;
  flex?: number;
};

const ProgressBar = (props: Props) => {
  const { min = 0, max = 100, items = [] } = props;

  if (props.type == "progress" && props.value != null) {
    const delta = max - min;
    const value = props.value - min;
    return <progress max={delta} value={value} />;
  } else if (props.type == "meter" && props.value != null) {
    return <meter min={min} max={max} value={props.value} />;
  }

  const blocks: ComponentChildren[] = [<div key={"blank"} />];
  items.forEach((item, index) => {
    const { color = "transparent", flex = 1 } = item;
    blocks.push(<div key={`item-${index}`} style={{ color, flex }} />);
  });
  return <div className={styles["progress-bar"]}>{blocks}</div>;
};

export default ProgressBar;
