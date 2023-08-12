import TripFilterView from '../view/trip-filter-view';
import TripInfoView from '../view/trip-info-view';
import { render } from '../render.js';

export default class HeaderPresenter {
  tripFilterComponent = new TripFilterView();
  tripInfoComponent = new TripInfoView();

  constructor({ tripFilterContainer, tripInfoContainer }) {
    this.tripInfoContainer = tripInfoContainer;
    this.tripFilterContainer = tripFilterContainer;
  }

  init() {
    render(this.tripInfoComponent, this.tripInfoContainer, 'afterbegin');
    render(this.tripFilterComponent, this.tripFilterContainer, 'afterbegin');
  }
}
