import { goodPointDate, capitalize } from '../utils/util.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';


const numberOnly = /^\d+$/;
const POINT_EDIT_DATE_FORMAT = 'DD/MM/YY HH:mm';

function getDestinationNames(destination){
  const destinationNames = destination.reduce((accumulator, dest) => [...accumulator, dest.name], []);
  return destinationNames;
}

function createDestinationTemplate(destinationNames) {
  return `<option value="${destinationNames}"></option>`;
}
function createPointImages(photos) {
  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${photos.map((photo) => `<img class="event__photo" src="${photo}">`).join('')}
      </div>
    </div>`;
}

function createTypeTemplate(type){
  const name = type.name.toLowerCase();
  return `
    <div class="event__type-item">
      <input id="event-type-${name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${name}">
      <label class="event__type-label  event__type-label--${name}" for="event-type-${name}-1">${type.name}</label>
    </div>`;

}

function createEventOfferSelectorTemplate(offers, checkedOffers, isDisabled) {

  if(offers){
    return offers.map((offer) =>
      `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" ${isDisabled ? 'disabled' : ''} id="${offer.id}" type="checkbox" name="event-offer-luggage" ${checkedOffers.find((off) => off.title === offer.title) ? 'checked' : ''}>
    <label class="event__offer-label" for="${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
    </div>`).join('');
  }
}

function createPointEditMarkup(point, destinations, pointTypes, allOffers) {
  const {dates, type, offers, cost, destination, isDisabled, isSaving, isDeleting,} = point;

  const destinationNames = getDestinationNames(destinations);
  const destionationsElements = destinationNames.map(createDestinationTemplate).join('');
  const pointTypesArray = Object.values(pointTypes);
  const findOffersArray = allOffers[type.name.toLowerCase()];

  const offersElements = createEventOfferSelectorTemplate(findOffersArray, offers, isDisabled);
  const typesElements = pointTypesArray.map(createTypeTemplate).join('');

  const startDate = goodPointDate(dates.start, POINT_EDIT_DATE_FORMAT);
  const endDate = goodPointDate(dates.end, POINT_EDIT_DATE_FORMAT);

  return (`<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${type.icon.slice(2)}" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typesElements}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type.name}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" ${isDisabled ? 'disabled' : ''} value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${destionationsElements}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" ${isDisabled ? 'disabled' : ''} value="${startDate}">
               &mdash;
         <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" ${isDisabled ? 'disabled' : ''} value="${endDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" ${isDisabled ? 'disabled' : ''} value="${cost}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
      </header>

      <section class="event__details">
      <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${offersElements}
      </div>
    </section>
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
          ${createPointImages(destination.photos)}
        </section>
      </section>
    </form>
  </li>`);
}

export default class PointEditView extends AbstractStatefulView {
  destinationNow = null;
  #datepickerStart = null;
  #datepickerEnd = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  constructor({point, onFormSubmit, onDeleteClick, destinations, pointTypes, offers}){
    super();
    this._destinations = destinations;
    this._pointTypes = pointTypes;
    this._allOffers = offers;
    this._setState(PointEditView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this._restoreHandlers();
  }

  get template() {
    return createPointEditMarkup(this._state, this._destinations, this._pointTypes, this._allOffers);
  }

  _restoreHandlers(){
    this.element.querySelector('form')
      .addEventListener('submit', this.formSubmitHandler);
    this.element.querySelector('form')
      .addEventListener('reset', this.#formDeleteClickHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('blur', this.#costInputHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('blur', this.#destinationInputHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offersinputHandler);
    this.#setDatepicker();
  }

  formSubmitHandler = (evt) =>{
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  removeElement() {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }
    if(this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  #formDeleteClickHandler = (evt) =>{
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    for (const key in point){
      point[key] ??= null;
    }
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }

  #offersinputHandler = (evt) => {
    let newOffers = null;
    const id = evt.target.id;
    if(this._state.offers){ //если в массиве state есть эллементы

      const matchArray = this._state.offers.find((offer) => offer.id === id);

      if(matchArray){
        if(matchArray.id === id){ //если уже присутствует в state - удаляем
          newOffers = this._state.offers.filter((offer) => offer.id !== id);
          this.updateElement({
            offers: newOffers
          });
          return;
        }
      }
    }

    newOffers = (this._allOffers[this._state.type.name.toLowerCase()] //если не присутствует в state
      .find((offer) => offer.id === id));

    this.updateElement({ offers: this._state.offers ? [...this._state.offers, newOffers] : newOffers });
  };

  #typeChangeHandler = (evt) => {
    const upName = capitalize(evt.target.value);
    const icon = Object.values(this._pointTypes)
      .find((type) => type.name === upName).icon;
    evt.preventDefault();
    this.updateElement({
      type: {name: upName, icon: icon}
    });
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    if(evt.target.value === this._state.destination.name){
      return;
    }

    if(!this._destinations.find((dest) => dest.name === evt.target.value)){
      this.updateElement({
        destination: this._state.destination
      });
      return;
    }

    this.updateElement({
      destination: this._destinations.find((dest) => dest.name === evt.target.value)//this._state.destination
    });
  };

  #costInputHandler = (evt) => {
    evt.preventDefault();
    const numbers = evt.target.value.match(numberOnly);
    if(!numbers){
      this.updateElement({
        cost: this._state.cost
      });
      return;
    }

    if(evt.target.value === this._state.cost){
      return;
    }

    if(evt.target.value <= 0 || evt.target.value !== numbers.toString()){
      this.updateElement({
        cost: this._state.cost
      });
      return;
    }

    this.updateElement({
      cost: evt.target.value
    });
  };

  #setDatepicker() {
      this.#datepickerStart = flatpickr(
        this.element.querySelectorAll('.event__input--time')[0],
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dates.start,
          onChange: this.#dateInputHandler,
        },
      );

      this.#datepickerEnd = flatpickr(
        this.element.querySelectorAll('.event__input--time')[1],
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dates.end,
          onChange: this.#dateInputHandler,
        },
      );

  }

  #dateInputHandler = (evt, day, isStartDate) => {
    if(isStartDate.config.defaultDate == this._state.dates.start){
      this.updateElement({
        dates: {start: evt[0], end: this._state.dates.end}
      })
    }
    else{
      this.updateElement({
        dates: {start: this._state.dates.start, end: evt[0]}
      })
    }
  };
}
