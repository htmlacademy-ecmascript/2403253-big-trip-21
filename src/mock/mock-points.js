import { getRandomDescriptionPhotos, getRandomBoolean, generateRandomInteger, getRandomArrayElement, getRandomDescriptionSentences, generateRandomDate } from '../utils/util';
import { nanoid } from 'nanoid';

const destinations = [
  {
    name: 'Naples',
    description: getRandomDescriptionSentences(),
    photos: getRandomDescriptionPhotos(),
  },
  {
    name: 'Rome',
    description: getRandomDescriptionSentences(),
    photos: getRandomDescriptionPhotos(),
  },
  {
    name: 'Milan',
    description: getRandomDescriptionSentences(),
    photos: getRandomDescriptionPhotos(),
  },
  {
    name: 'Turin',
    description: getRandomDescriptionSentences(),
    photos: getRandomDescriptionPhotos(),
  }
];

const PointTypes = {
  Taxi: {
    name: 'Taxi',
    icon: './img/icons/taxi.png'
  },
  Bus: {
    name: 'Bus',
    icon: './img/icons/bus.png'
  },
  Train: {
    name: 'Train',
    icon: './img/icons/train.png'
  },
  Ship: {
    name: 'Ship',
    icon: './img/icons/ship.png'
  },
  Flight:{
    name: 'Flight',
    icon : './img/icons/flight.png'
  },
  Checkin:{
    name: 'Check-in',
    icon: './img/icons/check-in.png'
  },
  Sightseeing:{
    name: 'Sightseeing',
    icon: './img/icons/sightseeing.png'
  },
  Restaurant:{
    name: 'Restaurant',
    icon: './img/icons/restaurant.png'
  }
};

const offers = {
  [PointTypes.Taxi.name]: [
    {
      name: 'Transfer',
      cost: 70,
      checked: getRandomBoolean()
    },
    {
      name: 'Meet in Airport and loading luggage',
      cost: 100,
      checked: getRandomBoolean()
    }
  ],

  [PointTypes.Bus.name]: [
    {
      name: 'Switch to comfort',
      cost: 80,
      checked: getRandomBoolean()
    }
  ],

  [PointTypes.Train.name]: [
    {
      name: 'Switch to coupe',
      cost: 50,
      checked: getRandomBoolean()
    },
    {
      name: 'Switch to luxe',
      cost: 80,
      checked: getRandomBoolean()
    }
  ],

  [PointTypes.Ship.name]: [
    {
      name: 'Restaurant Entrance',
      cost: 200,
      checked: getRandomBoolean()
    },
    {
      name: 'Massage Treatments',
      cost: 250,
      checked: getRandomBoolean()
    },
    {
      name: 'become a captain',
      cost: 1000,
      checked: false /*please!*/
    }
  ],

  [PointTypes.Flight.name]: [
    {
      name: 'additional meals',
      cost: 100,
      checked: getRandomBoolean()
    },
    {
      name: 'Switch to business',
      cost: 250,
      checked: getRandomBoolean()
    }
  ],

  [PointTypes.Checkin.name]: [
    {
      name: 'Premium room',
      cost: 130,
      checked: getRandomBoolean()
    },
    {
      name: 'Property insurance',
      cost: 80,
      checked: getRandomBoolean()
    }
  ],

  [PointTypes.Sightseeing.name]: [
    {
      name: 'Сonduct a tour',
      cost: 5,
      checked: getRandomBoolean()
    },
    {
      name: 'Meals',
      cost: 30,
      checked: getRandomBoolean()
    }
  ],

  [PointTypes.Sightseeing.name]: [
    {
      name: 'Сonduct a tour',
      cost: 5,
      checked: getRandomBoolean()
    },
    {
      name: 'Meals',
      cost: 30,
      checked: getRandomBoolean()
    }
  ],

  [PointTypes.Restaurant.name]: [
    {
      name: 'A dish from the chef',
      cost: 40,
      checked: getRandomBoolean()
    },
    {
      name: 'Sea view',
      cost: 30,
      checked: getRandomBoolean()
    }
  ],
};

function generateRandomWayPoint() {
  const randomPointType = getRandomArrayElement(Object.values(PointTypes));
  const [firstDate, secondDate] = generateRandomDate(2022, 2035);

  return ({
    id: nanoid(),
    type: randomPointType,
    destination: getRandomArrayElement(destinations),
    dates: {
      start: firstDate,
      end: secondDate
    },
    offers: offers[randomPointType.name],
    cost: generateRandomInteger(10, 1000),
    isFavorite: getRandomBoolean()
  });
}

export {generateRandomWayPoint, destinations, PointTypes, offers};
