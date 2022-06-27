import { Point } from "./Point";

export class Photo {
  static routeName = "photo";

  id?: number;
  path: string;
  is_in_album: boolean;
  is_public: boolean;
  updatedAt: string;
  createdAt: string;
  id_travel?: number;
  point?: Point;

  constructor({
    id,
    path = "",
    is_in_album = false,
    is_public = false,
    createdAt = "",
    updatedAt = "",
    id_travel,
    point,
  }: {
    id?: number;
    path: string;
    is_in_album: boolean;
    is_public: boolean;
    updatedAt: string;
    createdAt: string;
    id_travel?: number;
    point?: Point;
  }) {
    this.id = id;
    this.path = path;
    this.is_in_album = is_in_album;
    this.is_public = is_public;
    this.createdAt = createdAt === "" ? new Date().toISOString() : createdAt;
    this.updatedAt = updatedAt === "" ? new Date().toISOString() : updatedAt;
    this.id_travel = id_travel;
    this.point = point;
  }
}
