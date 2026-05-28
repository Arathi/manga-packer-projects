import { Manifest } from "../domains/manifest";
import { Task } from "../domains/task";

export interface Adapter {
  matched(): boolean;
  manifest(): Promise<Manifest>;
  tasks(id: string): Promise<Task[]>;
}
