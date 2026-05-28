export interface Task {
  id: string;
  fileName: string;
  url: string;
  status?: TaskStatus;
  loaded?: number;
  total?: number;
}

export enum TaskStatus {
  Pending = 0,
  Running = 1,
  Failure = 2,
  Success = 3,
}
