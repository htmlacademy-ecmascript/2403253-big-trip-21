import { generateRandomWayPoint } from '../mock/mock-points';

const POINTS_COUNT = 4;

export default class PointModel{
  #points = Array.from({length: POINTS_COUNT}, generateRandomWayPoint);

  get Points(){
    return this.#points;
  }
}
