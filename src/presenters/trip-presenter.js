import SortView from '../view/sort-view';
import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';
import ListView from '../view/list-view';
import NoPointView from '../view/no-point-view';

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
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const pointComponent = new PointView({
      point,
      onArrowClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });
    const pointEditComponent = new PointEditView({
      point,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#tripEventsComponent.element);
  }
}
