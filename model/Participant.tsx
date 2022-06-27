export class Participant {
  static routeName = "participant";

  id?: number;
  email: string;
  name: string;
  id_traveler: number;
  has_refused: boolean;

  constructor({
    id,
    email = "",
    name = "",
    id_traveler = 0,
    has_refused = false,
  }: {
    id: number;
    email: string;
    name: string;
    id_traveler: number;
    has_refused: boolean;
  }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.id_traveler = id_traveler;
    this.has_refused = has_refused;
  }
}
