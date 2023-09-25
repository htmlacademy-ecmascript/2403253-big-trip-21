import { FilterType } from './const';
import { isPointFuture, isPointExpired, isPointExpiringToday } from './util';

const filter = {
  [FilterType.ALL]: (points) => points.filter((point) => !point.isArchive),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dates.start) && !point.isArchive),
  [FilterType.PAST]: (points) => points.filter((point) => isPointExpired(point.dates.end) && !point.isArchive),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointExpiringToday(point.dates.end) && !point.isArchive)
};

export {filter};
