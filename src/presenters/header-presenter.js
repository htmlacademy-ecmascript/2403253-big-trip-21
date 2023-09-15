import TripFilterView from '../view/trip-filter-view';
import TripInfoView from '../view/trip-info-view';
import PointModel from '../model/point-model';
import {generateFilter} from '../mock/mock-filter';

import { render } from '../framework/render';

export default class HeaderPresenter {
  #tripInfoContainer = null;
  #tripFilterContainer = null;

  #tripFilterComponent = new TripFilterView();
  #tripInfoComponent = new TripInfoView();
  #pointModel = new PointModel();
  constructor({ tripFilterContainer, tripInfoContainer }) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#tripFilterContainer = tripFilterContainer;
  }

  init() {
    this.#renderTripInfo();
    this.#renderFilters();
  }

  #renderTripInfo(){
    render(this.#tripInfoComponent, this.#tripInfoContainer, 'afterbegin');

  }

  #renderFilters(){
    const filters = generateFilter(this.#pointModel.Points);
    render(new TripFilterView(filters), this.#tripFilterContainer, 'afterbegin');

  }
}
