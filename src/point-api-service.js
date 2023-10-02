import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class PointsApiService extends ApiService {
  // constructor(){
  //   super();
  // }
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get destinations(){
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers(){
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    const parsedResponse = await ApiService.parseResponse(response);
    //console.log(parsedResponse)
    return parsedResponse;
  }

  #adaptToServer(point) {
    point.offers = point.offers.map((obj) => obj.id);

    const adaptedPoint = {...point,
      'base_price': Number(point.cost),
      'date_from': point.dates.start instanceof Date ? point.dates.start.toISOString() : null, // На сервере дата хранится в ISO формате
      'date_to': point.dates.end instanceof Date ? point.dates.end.toISOString() : null, // На сервере дата хранится в ISO формате
      'destination': point.destination.id,
      'is_favorite': point.isFavorite,
      'type': point.type.name.toLowerCase(),
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoint.dates;
    delete adaptedPoint.price;
    delete adaptedPoint.cost;
    delete adaptedPoint.isFavorite;
    return adaptedPoint;

  }
}
