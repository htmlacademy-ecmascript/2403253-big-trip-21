import {render} from './framework/render.js';
import HeaderPresenter from './presenters/header-presenter.js';
import TripEventsPresenter from './presenters/trip-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenters/filter-presenter.js';
import PointNewView from './view/point-new-view.js';
import PointsApiService from './point-api-service.js';

const AUTHORIZATION = 'Basic gS25fS4dwcl1s32j';
const END_POINT = 'https://21.objects.pages.academy/big-trip';
const siteHeaderContainer = document.querySelector('.page-header');
const siteTripInfo = siteHeaderContainer.querySelector('.trip-main');

const siteBodyContainer = document.querySelector('.page-main');
const siteEventsElement = siteBodyContainer.querySelector('.trip-events');

const pointModel = new PointModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

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


tripEventsPresenter.init();
pointModel.init()
  .finally(() => {
    render(newPointButtonComponent, siteTripInfo);

    const headerPresenter = new HeaderPresenter({
      tripInfoContainer: siteTripInfo,
    });

    const filterPresenter = new FilterPresenter({
      filterContainer: siteTripInfo,
      filterModel,
      pointModel,
    });
    headerPresenter.init();
    filterPresenter.init();
  });
