import SortView from '../view/sort-view';
import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';
import ListView from '../view/list-view';
import NoPointView from '../view/no-point-view';
import BoardPointPresenter from './board-point-presenter';

import {RenderPosition, render, replace} from '../framework/render';

export default class TripEventsPresenter {
  #tripEventsContainer = null;
  #pointModel = null;

  #tripSortComponent = new SortView();
  #tripEventsComponent = new ListView();
  #noPointComponent = new NoPointView();

  #boardPoints = [];
  constructor({ tripEventsContainer, pointModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointModel = pointModel;
  }

  init() {
    this.#boardPoints = [...this.#pointModel.Points];
    this.#allRender();
  }



  #allRender(){

    this.#renderSort();
    this.#renderBoardPoints();
    this.#renderNoTasks();
  }

  #renderBoardPoints(){
    render(this.#tripEventsComponent, this.#tripEventsContainer);
    this.#boardPoints.forEach((point) => {
      this.#renderPoint(point);

    });
  }

  #renderNoTasks() {
    if (this.#boardPoints.every((point) => point.isArchive)) {
      render(this.#noPointComponent, this.#tripEventsComponent.element, RenderPosition.AFTERBEGIN);
      return;
    }
  }

  #renderSort() {
    render(this.#tripSortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new BoardPointPresenter({
      pointListContainer: this.#tripEventsComponent.element,
    });

    pointPresenter.init(point);
  }
}
