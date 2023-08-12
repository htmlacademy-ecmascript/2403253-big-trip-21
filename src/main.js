import HeaderPresenter from './presenters/header-presenter.js';
import TripEventsPresenter from './presenters/trip-presenter.js';

const siteHeaderContainer = document.querySelector('.page-header');
const siteTripInfo = siteHeaderContainer.querySelector('.trip-main');
const siteFilterControls = siteHeaderContainer.querySelector(
  '.trip-controls__filters'
);

const headerPresenter = new HeaderPresenter({
  tripInfoContainer: siteTripInfo,
  tripFilterContainer: siteFilterControls,
});

const siteBodyContainer = document.querySelector('.page-main');
const siteEventsElement = siteBodyContainer.querySelector('.trip-events');
const tripEventsPresenter = new TripEventsPresenter({
  tripEventsContainer: siteEventsElement,
});

headerPresenter.init();
tripEventsPresenter.init();
