import { FilterType } from './const';
import { isPointFuture, isPointExpired, isPointExpiringToday } from './util';

const filter = {
  [FilterType.ALL]: (points) => points.filter((point) => !point.isArchive),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dueDate) && !point.isArchive),
  [FilterType.PAST]: (points) => points.filter((point) => isPointExpired(point.dueDate) && !point.isArchive),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointExpiringToday(point.dueDate) && !point.isArchive)
};

export {filter};
