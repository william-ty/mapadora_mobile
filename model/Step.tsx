import { Point } from "./Point";
import { Element } from "./Element";

export class Step {
  static routeName = "step";

  id?: number;
  element: Element;
  point: Point;
  order: number;
  duration: number;
  id_trip?: number;

  constructor({
    id = undefined,
    element_step = new Element({
      id: undefined,
      name: "",
      description: "",
      predicted_date: new Date(),
      id_travel: 0,
    }),
    point = new Point({ type: "Point", coordinates: [] }),
    order = 0,
    duration = 1,
    id_trip,
  }: {
    id?: number;
    element_step: Element;
    point: Point;
    order: number;
    duration: number;
    id_trip?: number;
  }) {
    this.id = id;
    this.element = element_step;
    this.point = point;
    this.order = order;
    this.duration = duration;
    this.id_trip = id_trip;
  }
}
