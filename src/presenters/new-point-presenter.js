import {remove, render, RenderPosition} from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType} from '../utils/const.js';
import PointModel from '../model/point-model.js';

export default class NewPointPresenter {
  #pointModel = new PointModel();
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointEditComponent = null;
  #offers = null;
  #destinations = null;
  #pointTypes = null;

  constructor({pointListContainer, onDataChange, onDestroy, offers, destinations, pointTypes}) {

    //this.pointModel = pointModel;
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#pointTypes = pointTypes;
    //console.log(this.#point)
  }

  init() {
    const newPoint = this.#pointModel.generateNewPoint();
    //console.log(newPoint);
    if (this.#pointEditComponent !== null) {
      return;
    }
    this.#pointEditComponent = new PointEditView({
      point: newPoint[0],
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      destinations: this.#destinations,
      pointTypes: this.#pointTypes,
      offers: this.#offers,
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      // Пока у нас нет сервера, который бы после сохранения
      // выдывал честный id задачи, нам нужно позаботиться об этом самим
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
