import { generateRandomWayPoint, destinations, PointTypes, offers} from '../mock/mock-points';
import Observable from '../framework/observable';
export const POINTS_COUNT = 4;

export default class PointModel extends Observable{
  #points = Array.from({length: POINTS_COUNT}, generateRandomWayPoint);

  get Points(){
    return {
      points: this.#points,
      destinations: destinations,
      pointTypes: PointTypes,
      offers: offers,
    };
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((points) => points.id === update.id);
    console.log(this.#points)
    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((points) => points.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
