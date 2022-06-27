export class Document {
  static routeName = "document";

  id?: number;
  name?: string;
  id_element?: number;
  path?: string

  constructor({ id = undefined, name = "", id_element = undefined, path = "" }) {
    this.id = id;
    this.name = name;
    this.id_element = id_element;
    this.path = path
  }
}

