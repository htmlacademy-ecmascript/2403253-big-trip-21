import AbstractView from '../framework/view/abstract-view.js';
import { goodPointDate, getTimeDifference} from '../utils/util.js';

const POINT_DATE_FORMAT = 'MMM D';
const POINT_TIME_FORMAT = 'HH:mm';

function createPointOffersTemplate(offers, checkedOffers) {

  return offers.map((offer) =>

    checkedOffers.find((off) => off.title === offer.title) ? (
      `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>`) : ''
  ).join('');
}

function createPointMarkup(point, allOffers) {

  const {dates, type, offers, cost, destination, isFavorite} = point;
  const date = goodPointDate(dates.start, POINT_DATE_FORMAT);
  const dateFirstTime = goodPointDate(dates.start, POINT_TIME_FORMAT);
  const dateSecondTime = goodPointDate(dates.end, POINT_TIME_FORMAT);
  const timeDifference = getTimeDifference(dates.end, dates.start);
  const findOffersArray = allOffers[type.name.toLowerCase()];

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${date}">${date}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="${type.icon}" alt="Event type icon">
      </div>
      <h3 class="event__title">${type.name} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${dateFirstTime}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${dateSecondTime}</time>
        </p>
        <p class="event__duration">${timeDifference}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${cost}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${createPointOffersTemplate(findOffersArray, offers)}
      </ul>
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
}

export default class PointView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleArrowClick = null;
  #handleFavoriteClick = null;
  #handleArchiveClick = null;

  constructor({point, onArrowClick, onFavoriteClick, onArchiveClick, destinations, offers}){
    super();

    this.#offers = offers;
    this.#point = point;
    this.#destinations = destinations;
    this.#handleArrowClick = onArrowClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.#handleArchiveClick = onArchiveClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#arrowClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
    // this.element.querySelector('.card__btn--archive')
    //   .addEventListener('click', this.#archiveClickHandler);
  }

  get template() {
    return createPointMarkup(this.#point, this.#offers);
  }

  #arrowClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleArrowClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

  #archiveClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleArchiveClick();
  };
}
