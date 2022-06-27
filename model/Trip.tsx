import { Element } from "./Element";
import { TransportMode } from "./TransportMode";

export class Trip {
  static routeName = "trip";

  id?: number;
  element: Element;
  transport_mode?: TransportMode;

  constructor({
    id = undefined,
    element_trip = new Element({
      id: undefined,
      name: "",
      description: "",
      predicted_date: new Date(),
      id_travel: 0,
    }),
    transport_mode = undefined,
  }: {
    id?: number;
    element_trip: Element;
    transport_mode?: TransportMode;
  }) {
    this.id = id;
    this.element = element_trip;
    this.transport_mode = transport_mode;
  }
}
