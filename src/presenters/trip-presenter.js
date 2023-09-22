import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import NoPointView from '../view/no-point-view';
import BoardPointPresenter from './board-point-presenter';

import {RenderPosition, render} from '../framework/render';
import { updateItem } from '../utils/util';
import { SortType } from '../utils/const';
import { sortDateUp, sortTimeDown, sortPriseDown } from '../utils/util';

export default class TripEventsPresenter {
  #tripEventsContainer = null;
  #pointModel = null;
  #destinations = null;
  #offers = null;
  #pointTypes = null;
  #tripSortComponent = null;
  #tripEventsComponent = new ListView();
  #noPointComponent = new NoPointView();

  #boardPoints = [];
  #sourcedBoardPoints = [];

  #pointPresenters = new Map();
  #currentSortType = SortType.DEFAULT;


  constructor({ tripEventsContainer, pointModel}) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointModel = pointModel;
    this.#destinations = pointModel.Points.destinations;
    this.#offers = pointModel.Points.offers;
    this.#pointTypes = pointModel.Points.pointTypes;
  }

  init() {
    this.#boardPoints = [...this.#pointModel.Points.points];
    this.#sourcedBoardPoints = [...this.#pointModel.Points.points];
    this.#boardPoints.sort(sortDateUp);
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
    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleTaskChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;

    }
    this.#sortPoints(sortType);
    this.#clearTaskList();
    this.#renderBoardPoints();
  };

  #renderSort() {

    this.#tripSortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#tripSortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #sortPoints(sortType) {

    const sorter = {
      [SortType.DAY]: sortDateUp,
      [SortType.TIME]: sortTimeDown,
      [SortType.PRICE]: sortPriseDown,
    };
    this.#boardPoints = sortType in sorter ? this.#boardPoints.sort(sorter[sortType]) : [...this.#sourcedBoardPoints];

    this.#currentSortType = sortType;
  }

  #renderPoint(point) {
    const pointPresenter = new BoardPointPresenter({
      pointListContainer: this.#tripEventsComponent.element,
      onDataChange: this.#handleTaskChange,
      onModeChange: this.#handleModeChange,
      destinations: this.#destinations,
      pointTypes: this.#pointTypes,
      offers: this.#offers,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}
