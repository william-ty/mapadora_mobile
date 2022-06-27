import { TaskListTag } from "./TaskListTags";

export class Task {
  static routeName = "task";

  id?: number;
  name: string;
  execution_date: string | null;
  is_terminated: boolean;
  // createdAt: string;
  // updatedAt: string;
  id_element?: number;
  id_task_list?: number;
  TaskListTags: TaskListTag[];

  constructor({
    id = undefined,
    name = "",
    execution_date = "",
    is_terminated = false,
    // createdAt = "",
    // updatedAt = "",
    id_element = undefined,
    id_task_list = undefined,
    TaskListTags = new Array<TaskListTag>(),
  }: {
    id?: number;
    name: string;
    execution_date: string | null;
    is_terminated: boolean;
    // createdAt: string,
    // updatedAt: string,
    id_element?: number;
    id_task_list?: number;
    TaskListTags: TaskListTag[];
  }) {
    this.id = id;
    this.name = name;
    this.execution_date = execution_date;
    this.is_terminated = is_terminated;
    // this.createdAt = createdAt === "" ? new Date().toISOString() : createdAt;
    // this.updatedAt = updatedAt === "" ? new Date().toISOString() : updatedAt;
    this.id_element = id_element;
    this.id_task_list = id_task_list;
    this.TaskListTags = TaskListTags;
  }
}
