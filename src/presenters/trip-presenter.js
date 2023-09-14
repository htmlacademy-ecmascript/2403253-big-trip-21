import SortView from '../view/sort-view';
import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';
import ListView from '../view/list-view';
import NoPointView from '../view/no-point-view';
import BoardPointPresenter from './board-point-presenter';

import {RenderPosition, render, replace} from '../framework/render';
import { updateItem } from '../utils/util';

export default class TripEventsPresenter {
  #tripEventsContainer = null;
  #pointModel = null;

  #tripSortComponent = new SortView();
  #tripEventsComponent = new ListView();
  #noPointComponent = new NoPointView();

  #boardPoints = [];

  #pointPresenters = new Map();
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

  #clearTaskList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    //this.#renderedTaskCount = TASK_COUNT_PER_STEP;
    //remove(this.#loadMoreButtonComponent);
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

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleTaskChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderSort() {
    render(this.#tripSortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new BoardPointPresenter({
      pointListContainer: this.#tripEventsComponent.element,
      onDataChange: this.#handleTaskChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    console.log(point.id)
    this.#pointPresenters.set(point.id, pointPresenter);
    console.log(this.#pointPresenters)
  }
}
