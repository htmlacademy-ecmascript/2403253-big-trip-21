import SortView from '../view/sort-view';
import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';
import ListView from '../view/list-view';
import { render } from '../framework/render';

export default class TripEventsPresenter {
  #tripEventsContainer = null
  #pointModel = null

  #tripSortComponent = new SortView();
  #tripEventsComponent = new ListView();

  #boardPoints = []
  constructor({ tripEventsContainer, pointModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointModel = pointModel;
  }

  init() {
    this.#boardPoints = [...this.#pointModel.Points];

    render(this.#tripSortComponent, this.#tripEventsContainer);
    render(this.#tripEventsComponent, this.#tripEventsContainer);
    render(new PointEditView(this.#boardPoints[0]), this.#tripEventsComponent.element);

    for (let i = 1; i < this.#boardPoints.length; i++) {
      render(new PointView(this.#boardPoints[i]), this.#tripEventsComponent.element);
    }

    //render(new PointNewView(), this.tripEventsComponent.element());
  }
}
