import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export function capitalize(str){
  return str[0].toUpperCase() + str.slice(1);
}
export const DESTINATION_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  'Cras aliquet varius magna, non porta ligula feugiat eget. ',
  'Fusce tristique felis at fermentum pharetra. ',
  'Aliquam id orci ut lectus varius viverra. ',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
  'Sed sed nisi sed augue convallis suscipit in sed felis. ',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. ',
  'In rutrum ac purus sit amet tempus. '];

export function getRandomBoolean(){
  return Boolean(generateRandomInteger(0, 1));
}

export function getRandomDescriptionPhotos() {
  const photosArray = [];
  const photosCount = generateRandomInteger(1, 4);
  for(let i = 0; i < photosCount; i++){
    photosArray.push(`https://loremflickr.com/248/152?random=${generateRandomInteger(0, 100)}`);
  }

  return photosArray;
}

export function goodPointDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

export function generateRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomArrayElement(array) {
  return array[generateRandomInteger(0, array.length - 1)];
}

export function getRandomDescriptionSentences(){
  let description = '';
  const sentencesCount = generateRandomInteger(1, 5);
  for(let i = 0; i < sentencesCount; i++){
    description += getRandomArrayElement(DESTINATION_DESCRIPTIONS);
  }

  return description;
}

function leadZero(time) {
  return time.toString().padStart(2, '0');
}

function getDefaultTimeDifference(endTime, startTime){
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  return dayjs.duration(end.diff(start));
}

export function getTimeDifference(endTime, startTime) {
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  const timeDifference = dayjs.duration(end.diff(start));
  const days = leadZero(timeDifference.days());
  const hours = leadZero(timeDifference.hours());
  const minutes = leadZero(timeDifference.minutes());

  if(days > 0){
    return `${days}D ${hours}H ${minutes}M`;
  } else if(hours > 0){
    return `${hours}H ${minutes}M`;
  } else {
    return `${minutes}M`;
  }

}

export function generateRandomDate(startYear, endYear) {
  //const startYear = startYear;
  //const endYear = endYear;

  const year = generateRandomInteger(startYear, endYear);

  const firstMonth = generateRandomInteger(1, 12);
  const secondMonth = generateRandomInteger(firstMonth, 12);

  const firstDay = generateRandomInteger(1, 31);
  const secondDay = generateRandomInteger(firstDay, 31);

  const firstHour = generateRandomInteger(0, 23);
  const secondHour = generateRandomInteger(firstHour, 23);

  const firstMinutes = generateRandomInteger(0, 59);
  const secondMinutes = generateRandomInteger(firstMinutes, 59);

  return [
    `${year}-${firstMonth}-${firstDay} ${firstHour}:${firstMinutes}`,
    `${year}-${secondMonth}-${secondDay} ${secondHour}:${secondMinutes}`
  ];
}

export function isPointExpired(dueDate) {
  return dueDate && dayjs().isAfter(dueDate, 'D');
}

export function isPointFuture(dueDate){
  return dueDate && dayjs().isBefore(dueDate, 'D');
}

export function isPointRepeating(repeating) {
  return Object.values(repeating).some(Boolean);
}

export function isPointExpiringToday(dueDate) {
  return dueDate && dayjs(dueDate).isSame(dayjs(), 'D');
}

export function updateItem(items, update){
  return items.map((item) => item.id === update.id ? update : item);
}
function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

export function sortDateUp(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.dates.start, pointB.dates.start);
  return weight ?? dayjs(pointA.dates.start).diff(dayjs(pointB.dates.start));
}

export function sortTimeDown(pointA, pointB) {
  const weight = getWeightForNullDate(getDefaultTimeDifference(pointA.dates.end, pointA.dates.start),
    getDefaultTimeDifference(pointB.dates.end, pointB.dates.start));

  return weight ?? dayjs(getDefaultTimeDifference(pointB.dates.end, pointB.dates.start))
    .diff(dayjs(getDefaultTimeDifference(pointA.dates.end, pointA.dates.start)));
}

export function sortPriseDown(pointA, pointB){
  return pointB.cost - pointA.cost;
}
