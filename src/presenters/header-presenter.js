import TripInfoView from '../view/trip-info-view';
import { render } from '../framework/render';

export default class HeaderPresenter {
  #tripInfoContainer = null;
  #tripInfoComponent = new TripInfoView();

  constructor({tripInfoContainer}) {
    this.#tripInfoContainer = tripInfoContainer;
  }

  init() {
    this.#renderTripInfo();
  }

  #renderTripInfo(){
    render(this.#tripInfoComponent, this.#tripInfoContainer, 'afterbegin');

  }
}
