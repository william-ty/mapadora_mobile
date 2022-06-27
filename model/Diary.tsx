export class Diary {
  static routeName = "diary";

  id?: number;
  content: string;
  is_in_album: boolean;
  createdAt: string;
  updatedAt: string;
  id_travel?: number;
  id_traveler?: number;

  constructor({
    id = undefined,
    content = "",
    is_in_album = false,
    createdAt = "",
    updatedAt = "",
    id_travel = undefined,
    id_traveler = undefined,
  }) {
    this.id = id;
    this.content = content;
    this.is_in_album = is_in_album;
    this.createdAt = createdAt === "" ? new Date().toISOString() : createdAt;
    this.updatedAt = updatedAt === "" ? new Date().toISOString() : updatedAt;
    this.id_travel = id_travel;
    this.id_traveler = id_traveler;
  }
}
