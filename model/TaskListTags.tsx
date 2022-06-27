export class TaskListTag {
  static routeName = "tasklisttag";

  id?: number;
  name: string;
  idTaskList?: number;

  constructor({
    id = 0,
    name = "",
    idTaskList = 0,
  }: {
    id?: number;
    name: string;
    idTaskList?: number;
  }) {
    this.id = id;
    this.name = name;
    this.idTaskList = idTaskList;
  }
}
