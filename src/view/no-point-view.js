import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../utils/const.js';

const NoPointsTextType = {
  [FilterType.ALL]: 'Click «NEW EVENT» in menu to create your first event',
  [FilterType.FUTURE]: 'There are no plans for the future, click «NEW EVENT»',
  [FilterType.PRESENT]: 'There are no events today, click «NEW EVENT»',
  [FilterType.PAST]: 'There are no overdue events, click «NEW EVENT»',
};

function createNoPointMarkup(filterType) {
  const noPointsTextValue = NoPointsTextType[filterType];
  return (
    `<p class="trip-events__msg">
      ${noPointsTextValue}
    </p>`
  );
}
export default class NoPointView extends AbstractView {
  #filterType = FilterType.ALL;

  constructor(filterType) {
    super();

    if(filterType){
      this.#filterType = filterType;
    }

  }

  get template() {
    return createNoPointMarkup(this.#filterType);
  }
}
