import { type } from "@testing-library/user-event/dist/type";

export class Element {
  id?: number;
  name: string;
  description: string;
  id_travel: number;

  constructor({
    id = undefined,
    name = "",
    description = "",
    id_travel = 0,
  }: {
    id?: number;
    name: string;
    description: string;
    id_travel: number;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.id_travel = id_travel;
  }
}
