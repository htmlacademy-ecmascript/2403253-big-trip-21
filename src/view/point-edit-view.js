import { goodPointDate, capitalize } from '../utils/util.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

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

function createEventOfferSelectorTemplate(offers) {

  if(offers){
    return offers.map((offer) =>
      `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${offer.checked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-luggage-1">
      <span class="event__offer-title">${offer.name}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.cost}</span>
    </label>
    </div>`).join('');
  }
}

function createPointEditMarkup(point, destinations, pointTypes, allOffers) {
  const {dates, type, cost, destination} = point;

  const destinationNames = getDestinationNames(destinations);
  const destionationsElements = destinationNames.map(createDestinationTemplate).join('');
  const pointTypesArray = Object.values(pointTypes);
  const findOffersArray = allOffers[type.name];

  const offersElements = createEventOfferSelectorTemplate(findOffersArray);
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${destionationsElements}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
               &mdash;
         <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
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
    this.element.querySelector('.event__input--time')
      .addEventListener('blur', this.#DateInputHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('blur', this.#CostInputHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('blur', this.#destinationInputHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
  }

  formSubmitHandler = (evt) =>{
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) =>{
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  }
  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    const point = {...state};
    for (var key in point){
      if(!key) key = null;
    }
    return point
  }

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

  #CostInputHandler = (evt) => {
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

  #DateInputHandler = (evt) => {
    evt.preventDefault();
    // let trueDate = dayjs(evt.target.value);
    // trueDate = goodPointDate(evt.target.value, STRING_DATE_FORMAT);
    // //console.log(this._state.dates)


    // if(evt.target.id == 'event-start-time-1' && trueDate){
    //   console.log('первая дата подходит под условие')
    //   console.log(`дата превента: ${evt.target.value}`)
    //   this.updateElement({
    //     dates: {start: trueDate, end: this._state.dates.end}
    //   })
    //   this.updateElement({
    //     dates: {start: trueDate, end: this._state.dates.end}
    //   })
    //   console.log(`truDate: ${trueDate}`)
    //   console.log(goodPointDate(this._state.dates.start, POINT_EDIT_DATE_FORMAT))
    //   // this.updateElement({
    //   //   dates: {start: goodPointDate(this._state.dates.start, POINT_EDIT_DATE_FORMAT), end: this._state.dates.end}
    //   // });
    //   console.log(this._state.dates)
    //   return;
    // }
    // else if(evt.target.id == 'event-end-time-1' && evt.target.value){
    //   console.log('вторая дата подходит под условие')
    //   this._setState({
    //     dates: {start: this._state.dates.start, end: trueDate}
    //   })
    //   this.updateElement({
    //     dates: {start: this._state.dates.start, end: this._state.dates.end}
    //   });
    //   console.log(this._state.dates)
    //   return;
    // }
    // else {
    //   console.log('даты не подходят под условие')
    //   this._setState({
    //   dates: {start: this._state.dates.start, end: this._state.dates.end}
    //   });
    //   this.updateElement({
    //     dates: {start: this._state.dates.start, end: this._state.dates.end}
    //   });
    //   console.log(this._state.dates)
    //   return;

    // }

    // evt.preventDefault();
    // this.updateElement({
    //   dates: {start: this._state.dates.start, end: this._state.dates.end}
    // });

  };
}
