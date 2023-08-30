import SortView from '../view/sort-view';
import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';
import ListView from '../view/list-view';
import { render, replace } from '../framework/render';

export default class TripEventsPresenter {
  #tripEventsContainer = null
  #pointModel = null

  #tripSortComponent = new SortView();
  #tripEventsComponent = new ListView();

  #boardPoints = []
  constructor({ tripEventsContainer, pointModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointModel = pointModel;
  }

  init() {
    this.#boardPoints = [...this.#pointModel.Points];

    render(this.#tripSortComponent, this.#tripEventsContainer);
    render(this.#tripEventsComponent, this.#tripEventsContainer);
   // render(new PointEditView(this.#boardPoints[0]), this.#tripEventsComponent.element);

    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoint(this.#boardPoints[i]);
    }
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
};
