import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import NoPointView from '../view/no-point-view';
import BoardPointPresenter from './board-point-presenter';
import { POINTS_COUNT } from '../model/point-model';
import {RenderPosition, render, remove} from '../framework/render';
import NewPointPresenter from './new-point-presenter';
//import PointModel from '../model/point-model';

import { SortType, UpdateType, UserAction, FilterType } from '../utils/const';
import { sortDateUp, sortTimeDown, sortPriseDown } from '../utils/util';
import {filter} from '../utils/filter.js';

export default class TripEventsPresenter {
  //#pointModelForNewPoint = new PointModel();
  #tripEventsContainer = null;
  #pointModel = null;
  #filterModel = null;
  #newPointPresenter = null;
  #destinations = null;
  #offers = null;
  #pointTypes = null;
  #tripSortComponent = null;
  #tripEventsComponent = new ListView();
  #noPointComponent = null;
  #renderedPointCount = POINTS_COUNT;
  #pointPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor({ tripEventsContainer, pointModel, filterModel, onNewTaskDestroy}) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;
    this.#destinations = pointModel.Points.destinations;
    this.#offers = pointModel.Points.offers;
    this.#pointTypes = pointModel.Points.pointTypes;
    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#tripEventsComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewTaskDestroy,
      offers: this.#offers,
      destinations: this.#destinations,
      pointTypes: this.#pointTypes,


    });

    this.#pointModel.addObserver(this.#handleModelEvent); //возможно pointModel.Points.points
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.Points.points; //pointModel just?
    const filteredPoints = filter[this.#filterType](points);
    const sorter = {
      [SortType.DAY]: sortDateUp,
      [SortType.TIME]: sortTimeDown,
      [SortType.PRICE]: sortPriseDown,
    };

    return this.#currentSortType in sorter ?
      filteredPoints.sort(sorter[this.#currentSortType]) : filteredPoints.sort(sortDateUp);
  }

  init() {
    this.#allRender();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this.#newPointPresenter.init();
  }

  #allRender(){
    this.#renderBoardPoints();
  }

  #renderBoardPoints(){
    this.#renderSort();
    const points = this.points;
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this.#renderNoTasks();
      return;
    }
    render(this.#tripEventsComponent, this.#tripEventsContainer);
    this.#renderPoints(points); //.slice(0, Math.min(pointsCount, this.#renderedPointCount)));
  }

  #renderPoints(points){
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderNoTasks() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });
    //if (this.points.every((point) => point.isArchive)) {
    render(this.#noPointComponent, this.#tripEventsComponent.element, RenderPosition.AFTERBEGIN);
    //}
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoardPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedPointCount: true, resetSortType: true});
        this.#renderBoardPoints();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;

    }
    this.#currentSortType = sortType;
    // this.#clearTaskList();
    // this.#renderBoardPoints();
    this.#clearBoard({resetRenderedTaskCount: true});
    this.#renderBoardPoints();
  };

  #renderSort() {

    this.#tripSortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#tripSortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #clearBoard({resetRenderedPointCount = false, resetSortType = false} = {}) {
    const pointCount = this.points.length;

    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#tripSortComponent);
    remove(this.#noPointComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetRenderedPointCount) {
      this.#renderedPointCount = POINTS_COUNT;
    } else {
      this.#renderedPointCount = Math.min(pointCount, this.#renderedPointCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderPoint(point) {
    const pointPresenter = new BoardPointPresenter({
      pointListContainer: this.#tripEventsComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      destinations: this.#destinations,
      pointTypes: this.#pointTypes,
      offers: this.#offers,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}
