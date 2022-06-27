import { Point } from "./Point";
import { Element } from "./Element";

export class InterestPoint {
  static routeName = "interestpoint";

  id?: number;
  element: Element;
  point: Point;
  order: number;
  day?: number;
  id_step?: number;

  constructor({
    id,
    element,
    point,
    order = 0,
    day,
    id_step,
  }: {
    id?: number;
    element: Element;
    point: Point;
    order: number;
    day?: number;
    id_step?: number;
  }) {
    this.id = id;
    this.element = element;
    this.point = point;
    this.order = order;
    this.day = day;
    this.id_step = id_step;
  }
}
