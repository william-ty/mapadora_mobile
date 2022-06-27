import { Step } from "../model/Step";
import { Travel } from "../model/Travel";

export {};
// import { useData } from "../providers/DataProvider";
// import { useAuth } from "./auth";

// API Endpoint
// export const url_prefix = "http://92.222.190.119:8080";

export const url_prefix = "http://mapadora.fr:8080";
export const document_url_prefix = "https://mapadora.fr:8443";
// export const url_prefix = "http://192.168.43.73:8080";
// export const url_prefix = "http://192.168.43.73:8080";
const LOCAL_DATE = "fr-FR";

// Method: Checks response status
export const checkStatus = async (res: any) => {
  if (res.ok) {
    return res;
  } else {
    return res.text().then((msg: any) => {
      throw new Error(msg);
    });
  }
};

const dateIsToday = (date: Date) => {
  const currentDate = new Date();
  return (
    date.toLocaleDateString(LOCAL_DATE) ===
    currentDate.toLocaleDateString(LOCAL_DATE)
  );
};

export const printDate = (date: Date, showHour = true) => {
  const dayInMillis = 1000 * 60 * 60 * 24;

  let dateToDisplay;
  const getHours = date.getHours();
  const getMinutes = date.getMinutes();
  let hourToDisplay = `${getHours < 10 ? "0" + getHours : getHours}:${
    getMinutes < 10 ? "0" + getMinutes : getMinutes
  }`;

  if (dateIsToday(date)) {
    dateToDisplay = hourToDisplay;
    showHour = false;
  } else if (dateIsToday(new Date(date.getTime() + dayInMillis))) {
    dateToDisplay = "hier";
  } else if (dateIsToday(new Date(date.getTime() + dayInMillis * 2))) {
    dateToDisplay = "avant-hier";
  } else {
    dateToDisplay = date.toLocaleDateString(LOCAL_DATE);
  }

  if (showHour) dateToDisplay += ` à ${hourToDisplay}`;
  return dateToDisplay;
};

// toLocaleDateString don't work on android
export const dateToFrenchFormat = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const formattedDate = `${day < 10 ? "0" + day : day}/${
    month < 10 ? "0" + month : month
  }/${date.getFullYear()}`;

  return formattedDate;
};

export const getDurationUntilStep = (steps: Step[], stepId: number = -1) => {
  let i = 0;
  let loop = true;
  let currentDay = 0;
  while (loop && steps && i < steps?.length) {
    if (steps[i]) {
      const step = steps[i];
      if (stepId === step.id) loop = false;
      else {
        currentDay += step.duration;
      }
    }
    i++;
  }
  return currentDay;
};

export const getTravelStartDate = (travel: Travel) => {
  let predictedDate = travel?.predicted_date
    ? new Date(travel.predicted_date)
    : null;
  let startDate = travel?.start_date ? new Date(travel.start_date) : null;
  return startDate || predictedDate;
};
