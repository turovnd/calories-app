export const formatDate = (date) => {
  date = new Date(date);
  date.setSeconds(0);
  return date;
};

export const formatStartOfDate = (date) => {
  date = new Date(date);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
};

export const formatEndOfDate = (date) => {
  date = new Date(date);
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  return date;
};
