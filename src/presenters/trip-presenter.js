import SortView from "../view/sort-view";
import PointView from "../view/point-view";
import PointNewView from "../view/point-new-view";
import PointEditView from "../view/point-edit-view";
import ListView from "../view/list-view";
import { render } from "../render.js";

export default class TripEventsPresenter {
  tripSortComponent = new SortView();
  tripEventsComponent = new ListView();

  constructor({ tripEventsContainer }) {
    this.tripEventsContainer = tripEventsContainer;
  }

  init() {
    render(this.tripSortComponent, this.tripEventsContainer);
    render(this.tripEventsComponent, this.tripEventsContainer);
    render(new PointEditView(), this.tripEventsComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.tripEventsComponent.getElement());
    }

    render(new PointNewView(), this.tripEventsComponent.getElement());
  }
}
