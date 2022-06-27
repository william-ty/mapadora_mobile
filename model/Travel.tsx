export class Travel {
  static routeName = "travel";

  id?: number;
  name: string;
  duration: number;
  start_date: string | null;
  end_date: string | null;
  predicted_date: string | null;
  stepsNumber: number;
  is_public: boolean;
  is_album_public: boolean;
  path_uid: string;
  commentary: string;
  path: string;
  id_traveltag: number;
  Travel_Traveler?: any;
  id_public_travel?: number;

  constructor({
    id,
    name = "",
    duration = 1,
    start_date = "",
    end_date = "",
    predicted_date = "",
    stepsNumber = 1,
    is_public = true,
    is_album_public = false,
    path_uid = "",
    commentary = "",
    path = "",
    id_traveltag = 1,
    id_public_travel,
    Travel_Traveler,
  }: {
    id: number;
    name: string;
    duration: number;
    start_date: string | null;
    end_date: string | null;
    predicted_date: string | null;
    stepsNumber: number;
    is_public: boolean;
    is_album_public: boolean;
    path_uid: string;
    commentary: string;
    path: string;
    id_traveltag: number;
    id_public_travel?: number;
    Travel_Traveler?: any;
  }) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.start_date = start_date;
    this.end_date = end_date;
    this.predicted_date = predicted_date;
    this.stepsNumber = stepsNumber;
    this.is_public = is_public;
    this.is_album_public = is_album_public;
    this.path_uid = path_uid;
    this.commentary = commentary;
    this.path = path;
    this.id_traveltag = id_traveltag;
    this.Travel_Traveler = Travel_Traveler;
    this.id_public_travel = id_public_travel;
  }
}
