import { Point } from "./Point";

export class Position {
  static routeName = "position";

  id?: number;
  point: Point;
  id_travel?: number;
  id_traveler?: number;

  constructor({
    id,
    point = new Point({ type: "Point", coordinates: [] }),
    id_travel,
    id_traveler,
  }: {
    id?: number;
    point: Point;
    id_travel?: number;
    id_traveler?: number;
  }) {
    this.id = id;
    this.point = point;
    this.id_travel = id_travel;
    this.id_traveler = id_traveler;
  }
}
