import SortView from '../view/sort-view';
import PointView from '../view/point-view';
import PointNewView from '../view/point-new-view';
import PointEditView from '../view/point-edit-view';
import ListView from '../view/list-view';
import { render } from '../render.js';

export default class TripEventsPresenter {
  tripSortComponent = new SortView();
  tripEventsComponent = new ListView();

  constructor({ tripEventsContainer, pointModel }) {
    this.tripEventsContainer = tripEventsContainer;
    this.pointModel = pointModel;
  }

  init() {
    this.boardPoints = [...this.pointModel.getPoints()];

    render(this.tripSortComponent, this.tripEventsContainer);
    render(this.tripEventsComponent, this.tripEventsContainer);
    render(new PointEditView(this.boardPoints[0]), this.tripEventsComponent.getElement());

    for (let i = 1; i < this.boardPoints.length; i++) {
      render(new PointView(this.boardPoints[i]), this.tripEventsComponent.getElement());
    }

    //render(new PointNewView(), this.tripEventsComponent.getElement());
  }
}
