import HeaderPresenter from './presenters/header-presenter.js';
import TripEventsPresenter from './presenters/trip-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenters/filter-presenter.js';

const siteHeaderContainer = document.querySelector('.page-header');
const siteTripInfo = siteHeaderContainer.querySelector('.trip-main');

const siteBodyContainer = document.querySelector('.page-main');
const siteEventsElement = siteBodyContainer.querySelector('.trip-events');

const pointModel = new PointModel();
const filterModel = new FilterModel();

const tripEventsPresenter = new TripEventsPresenter({
  tripEventsContainer: siteEventsElement, pointModel, filterModel,
});

const headerPresenter = new HeaderPresenter({
  tripInfoContainer: siteTripInfo,
});

const filterPresenter = new FilterPresenter({
  filterContainer: siteTripInfo,
  filterModel,
  pointModel,
});

filterPresenter.init();
headerPresenter.init();
tripEventsPresenter.init();

