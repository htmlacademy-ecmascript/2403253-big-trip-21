import Observable from '../framework/observable';
import { UpdateType } from '../utils/const';
import { capitalize } from '../utils/util';

const PointTypes = {
  Taxi: {
    name: 'Taxi',
    icon: './img/icons/taxi.png'
  },
  Bus: {
    name: 'Bus',
    icon: './img/icons/bus.png'
  },
  Train: {
    name: 'Train',
    icon: './img/icons/train.png'
  },
  Ship: {
    name: 'Ship',
    icon: './img/icons/ship.png'
  },
  Flight:{
    name: 'Flight',
    icon : './img/icons/flight.png'
  },
  Checkin:{
    name: 'Check-in',
    icon: './img/icons/check-in.png'
  },
  Sightseeing:{
    name: 'Sightseeing',
    icon: './img/icons/sightseeing.png'
  },
  Restaurant:{
    name: 'Restaurant',
    icon: './img/icons/restaurant.png'
  },
  Drive:{
    name: 'Drive',
    icon: './img/icons/drive.png'
  }
};

export default class PointModel extends Observable{
  //#points = Array.from({length: POINTS_COUNT}, generateRandomWayPoint);
  #pointsApiService = null;
  #points = [];
  #destinations = null;
  #offers = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get Points(){
    return {
      points: this.#points,
      destinations: this.#destinations,
      pointTypes: PointTypes,
      offers: this.#offers,
    };
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#destinations = await this.#getServerDestinations();
      this.#offers = await this.#getServerOffers();
      this.#points = points.map(this.#adaptToClient.bind(this));
    } catch(err) {
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  }

  async #getServerDestinations(){
    const serverDestinations = await this.#pointsApiService.destinations;
    const destinations = serverDestinations.map((obj) => ({
      ...obj,
      photos: obj.pictures.map((pic) => pic.src)
    }));
    for (const obj of destinations) {
      delete obj.pictures;
    }
    return destinations;

  }

  async #getServerOffers(){
    const serverOffers = await this.#pointsApiService.offers;
    const offersName = serverOffers.map((obj) => obj.type);

    const offers = offersName.reduce((accumulator, value, index) => {
      accumulator[offersName[index]] = serverOffers[index].offers;
      return accumulator;
    }, {});

    return offers;
  }


  getPointById(update){
    return this.#points.findIndex((points) => points.id === update.id);
  }

  async updatePoint(updateType, update) {
    const index = this.getPointById(update);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.getPointById(update);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  getClientType(point){
    return PointTypes.map((obj) => obj === point.type);
  }

  #adaptToClient(point) {
    const offers = point.offers.map((offer) => ({
      id: offer,
      title: this.#offers[point.type].find((obj) => obj.id === offer).title
    }));

    const adaptedPoint = {...point,
      destination: this.#destinations.find((obj) => obj.id === point.destination),
      dates: {
        start: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
        end: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to']
      },
      offers: offers,
      cost: point['base_price'],
      isFavorite: point['is_favorite'],
      type: Object.values(PointTypes).find((obj) => obj.name === capitalize(point['type'])),
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
