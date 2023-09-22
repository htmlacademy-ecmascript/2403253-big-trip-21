import { generateRandomWayPoint, destinations, PointTypes, offers} from '../mock/mock-points';
const POINTS_COUNT = 4;

export default class PointModel{
  #points = Array.from({length: POINTS_COUNT}, generateRandomWayPoint);

  get Points(){
    return {
      points: this.#points,
      destinations: destinations,
      pointTypes: PointTypes,
      offers: offers,
      }
    }
}
