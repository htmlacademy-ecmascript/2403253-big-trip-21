import {render} from './framework/render.js';
import HeaderPresenter from './presenters/header-presenter.js';
import TripEventsPresenter from './presenters/trip-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenters/filter-presenter.js';
import PointNewView from './view/point-new-view.js';

const siteHeaderContainer = document.querySelector('.page-header');
const siteTripInfo = siteHeaderContainer.querySelector('.trip-main');

const siteBodyContainer = document.querySelector('.page-main');
const siteEventsElement = siteBodyContainer.querySelector('.trip-events');

const pointModel = new PointModel();
const filterModel = new FilterModel();

const tripEventsPresenter = new TripEventsPresenter({
  tripEventsContainer: siteEventsElement,
  pointModel,
  filterModel,
  onNewTaskDestroy: handleNewTaskFormClose,
});

const newPointButtonComponent = new PointNewView({
  onClick: handleNewTaskButtonClick
});

function handleNewTaskFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewTaskButtonClick() {
  tripEventsPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}
const headerPresenter = new HeaderPresenter({
  tripInfoContainer: siteTripInfo,
});

const filterPresenter = new FilterPresenter({
  filterContainer: siteTripInfo,
  filterModel,
  pointModel,
});

render(newPointButtonComponent, siteTripInfo);

filterPresenter.init();
headerPresenter.init();
tripEventsPresenter.init();

