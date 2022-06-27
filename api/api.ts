import { checkStatus, url_prefix } from "./util";
// import { LngLatLike } from "mapbox-gl";

// Models
import { Step } from "../model/Step";
import { InterestPoint } from "../model/InterestPoint";
import { Traveler } from "../model/Traveler";
import { Document } from "../model/Document";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type APIObject = Step | InterestPoint | Traveler | Document;

/* AUTOMATICALLY GET ROUTENAME - PARTIALLY WORKS 
// V1
const getRouteName = (object: APIObject) => {
  switch (object.constructor) {
    case Step:
      return Step.routeName;
    case InterestPoint:
      return InterestPoint.routeName;
  }
};
// V2
const getRouteName = (object: APIObject) => {
  let routeName = "";

  if (object instanceof InterestPoint) routeName = InterestPoint.routeName;
  else if (object instanceof Step) routeName = Step.routeName;

  return routeName;
};
*/

const USE_TOKEN_BY_DEFAULT = true;
const getToken = () => AsyncStorage.getItem("token");

//! Keep comments for JWT implementation
const api = {
  // CREATE
  create: async ({
    route,
    body,
    hasToken = USE_TOKEN_BY_DEFAULT,
    idTravel,
  }: CreateType) => {
    return getToken().then((token) => {
      return fetch(
        `${url_prefix}/${idTravel ? `travel/${idTravel}/` : ``}${route}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      )
        .then(checkStatus)
        .then((res) => res.json());

      // });
    });
  },

  // READ
  get: async ({
    route,
    hasToken = USE_TOKEN_BY_DEFAULT,
    idTravel,
  }: GetType) => {
    return getToken().then((token) => {
      return fetch(
        `${url_prefix}/${idTravel ? `travel/${idTravel}/` : ``}${route}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then(checkStatus)
        .then((res) => res.json());
    });
  },
  getOne: async ({
    route,
    id,
    hasToken = USE_TOKEN_BY_DEFAULT,
    idTravel,
  }: GetOneType) => {
    if (hasToken) {
      let token = await getToken();
    }
    return getToken().then((token) => {
      return fetch(
        `${url_prefix}/${idTravel ? `travel/${idTravel}/` : ``}${route}/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then(checkStatus)
        .then((res) => res.json());
    });
  },

  // UPDATE
  update: async ({
    route,
    id,
    body,
    hasToken = USE_TOKEN_BY_DEFAULT,
    idTravel,
  }: UpdateType) => {
    return getToken().then((token) => {
      return fetch(
        `${url_prefix}/${idTravel ? `travel/${idTravel}/` : ``}${route}/${id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      )
        .then(checkStatus)
        .then((res) => res.json());
    });
  },

  // DELETE
  delete: async ({
    route,
    id,
    hasToken = USE_TOKEN_BY_DEFAULT,
    idTravel,
  }: DeleteType) => {
    if (hasToken) {
      let token = await getToken();
    }
    return getToken().then((token) => {
      return fetch(
        `${url_prefix}/${idTravel ? `travel/${idTravel}/` : ``}${route}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      )
        .then(checkStatus)
        .then((res) => res.json());
    });
  },
  // FORMDATA
  createWithFormData: ({
    route,
    formData,
    hasToken = USE_TOKEN_BY_DEFAULT,
    idTravel,
  }: CreateWithFormDataType) => {
    return getToken().then((token) => {
      return fetch(
        `${url_prefix}/${idTravel ? `travel/${idTravel}/` : ``}${route}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )
        .then(checkStatus)
        .then((res) => res.json())
        .catch((e) => console.log(e));
    });
  },
  // FORMDATA
  updateWithFormData: ({
    route,
    id,
    formData,
    hasToken = USE_TOKEN_BY_DEFAULT,
    idTravel,
  }: UpdateWithFormDataType) => {
    return getToken().then((token) => {
      return fetch(
        `${url_prefix}/${idTravel ? `travel/${idTravel}/` : ``}${route}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )
        .then(checkStatus)
        .then((res) => res.json())
        .catch((e) => console.log(e));
    });
  },

  // UPDATE ORDER
  reorder: async ({
    route,
    body,
    hasToken = USE_TOKEN_BY_DEFAULT,
    idTravel,
  }: ReorderType) => {
    return getToken().then((token) => {
      return fetch(
        `${url_prefix}/${
          idTravel ? `travel/${idTravel}/` : ``
        }${route}/reorder/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      )
        .then(checkStatus)
        .then((res) => res.json())
        .catch((e) => console.log(e));
    });
  },

  // createWithFormData: async ({
  //   route,
  //   formData,
  //   hasToken = USE_TOKEN_BY_DEFAULT,
  //   idTravel
  // }: {
  //   route: string;
  //   formData: FormData;
  //   hasToken?: boolean;
  //   idTravel?:number
  // }) => {
  //   return tokenProvider.getToken().then((token) => {
  //   return fetch(`${url_prefix}/${idTravel ? `travel/${idTravel}/` : ``}${route}/`, {
  //     method: "POST",
  //     body: formData,
  //     headers : {
  //     authorization: `Bearer ${token}` ,
  //     }
  //   })
  //     .then(checkStatus)
  //     .then((res) => res.json())
  //     .catch((e) => console.log(e));
  //   // });
  // })
  // },
  // // FORMDATA
  // updateWithFormData: ({
  //   route,
  //   formData,
  //   hasToken = USE_TOKEN_BY_DEFAULT,
  // }: {
  //   route: string;
  //   formData: FormData;
  //   hasToken?: boolean;
  // }) => {
  //   // return getToken().then((token) => {
  //   return fetch(`${url_prefix}${route}/`, {
  //     method: "PUT",
  //     body: formData,
  //   })
  //     .then(checkStatus)
  //     .then((res) => res.json())
  //     .catch((e) => console.log(e));
  //   // });
  // },
};

export default api;

export type CreateType = {
  route: string;
  body: APIObject;
  hasToken?: boolean;
  idTravel?: number;
};
export type CreateWithFormDataType = {
  route: string;
  formData: FormData;
  hasToken?: boolean;
  idTravel?: number;
};
export type GetType = {
  route: string;
  hasToken?: boolean;
  idTravel?: number;
};
export type GetOneType = {
  route: string;
  id: number;
  hasToken?: boolean;
  idTravel?: number;
};
export type UpdateType = {
  route: string;
  id: number;
  body: APIObject;
  hasToken?: boolean;
  idTravel?: number;
};
export type UpdateWithFormDataType = {
  route: string;
  id: number;
  formData: FormData;
  hasToken?: boolean;
  idTravel?: number;
};
export type DeleteType = {
  route: string;
  id: number;
  hasToken?: boolean;
  idTravel?: number;
};
export type ReorderType = {
  route: string;
  body: APIObject[];
  hasToken?: boolean;
  idTravel?: number;
};
