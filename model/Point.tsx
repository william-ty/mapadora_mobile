
export class Point {
  type: string;
  coordinates: Array<number>;

  constructor({type = "Point", coordinates = []} : {
    type:string,
    coordinates: Array<number>
  }) {
    this.coordinates = coordinates;
    this.type = type;
  }
}
