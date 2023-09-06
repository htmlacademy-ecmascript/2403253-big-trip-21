import HeaderPresenter from './presenters/header-presenter.js';
import TripEventsPresenter from './presenters/trip-presenter.js';
import PointModel from './model/point-model.js';


const siteHeaderContainer = document.querySelector('.page-header');
const siteTripInfo = siteHeaderContainer.querySelector('.trip-main');
const siteFilterControls = siteHeaderContainer.querySelector(
  '.trip-controls__filters'
);
const siteBodyContainer = document.querySelector('.page-main');
const siteEventsElement = siteBodyContainer.querySelector('.trip-events');

const pointModel = new PointModel();
const tripEventsPresenter = new TripEventsPresenter({
  tripEventsContainer: siteEventsElement, pointModel,
});

const headerPresenter = new HeaderPresenter({
  tripInfoContainer: siteTripInfo,
  tripFilterContainer: siteFilterControls,
});


headerPresenter.init();
tripEventsPresenter.init();
