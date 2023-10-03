import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import NoPointView from '../view/no-point-view';
import BoardPointPresenter from './board-point-presenter';
import {RenderPosition, render, remove} from '../framework/render';
import NewPointPresenter from './new-point-presenter';
import LoadingView from '../view/loading-view';

import { SortType, UpdateType, UserAction, FilterType } from '../utils/const';
import { sortDateUp, sortTimeDown, sortPriseDown } from '../utils/util';
import {filter} from '../utils/filter.js';
const POINTS_COUNT = 4;
export default class TripEventsPresenter {
  #tripEventsContainer = null;
  #pointModel = null;
  #filterModel = null;
  #newPointPresenter = null;
  #onNewTaskDestroy = null;
  #destinations = null;
  #offers = null;
  #pointTypes = null;
  #tripSortComponent = null;
  #loadingComponent = new LoadingView();
  #tripEventsComponent = new ListView();
  #noPointComponent = null;
  #renderedPointCount = POINTS_COUNT;
  #pointPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;
  constructor({ tripEventsContainer, pointModel, filterModel, onNewTaskDestroy}) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;
    this.#destinations = pointModel.points.destinations;
    this.#offers = pointModel.points.offers;
    this.#pointTypes = pointModel.points.pointTypes;
    this.#onNewTaskDestroy = onNewTaskDestroy;


    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points.points;
    const filteredPoints = filter[this.#filterType](points);
    const sorter = {
      [SortType.DAY]: sortDateUp,
      [SortType.TIME]: sortTimeDown,
      [SortType.PRICE]: sortPriseDown,
    };
    return filteredPoints.sort(sorter[this.#currentSortType] || sortDateUp);
  }

  get destinations(){
    return this.#pointModel.points.destinations;
  }
  get newPoint(){
    return this.#pointModel.newPoint;
  }
  get offers(){
    return this.#pointModel.points.offers;
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

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    this.#renderSort();
    const points = this.points;
    const destinations = this.destinations;
    const offers = this.offers;
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this.#renderNoTasks();
      return;
    }
    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#tripEventsComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#onNewTaskDestroy,
      offers: this.offers,
      destinations: this.destinations,
      pointTypes: this.#pointTypes,
      newPoint: this.newPoint,
    });
    render(this.#tripEventsComponent, this.#tripEventsContainer);


    this.#renderPoints(points, destinations, offers);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripEventsContainer);
  }

  #renderPoints(points, destinations, offers){
    points.forEach((point) => {
      this.#renderPoint(point, destinations, offers);
    });
  }

  #renderNoTasks() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });
    render(this.#noPointComponent, this.#tripEventsComponent.element, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoardPoints();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;

    }
    this.#currentSortType = sortType;
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

  #renderPoint(point, destinations, offers) {
    const pointPresenter = new BoardPointPresenter({
      pointListContainer: this.#tripEventsComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      pointTypes: this.#pointTypes,
    });

    pointPresenter.init(point, destinations, offers);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}
