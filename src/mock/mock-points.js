import { getRandomDescriptionPhotos, getBoolean, generateRandomInteger, getRandomArrayElement, getRandomDescriptionSentences, generateRandomDate } from '../util';


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
    icon: './img/icons/taxi.png'
  },
  Train: {
    name: 'Train',
    icon: './img/icons/taxi.png'
  },
  Ship: {
    name: 'Ship',
    icon: './img/icons/taxi.png'
  },
  Flight:{
    name: 'Flight',
    icon : './img/icons/flight.png'
  }
};

const offers = {
  [PointTypes.Taxi.name]: [
    {
      name: 'Transfer',
      cost: 70,
      checked: getBoolean()
    },
    {
      name: 'Meet in Airport and loading luggage',
      cost: 100,
      checked: getBoolean()
    }
  ],

  [PointTypes.Bus.name]: [
    {
      name: 'Switch to comfort',
      cost: 80,
      checked: getBoolean()
    }
  ],

  [PointTypes.Train.name]: [
    {
      name: 'Switch to coupe',
      cost: 50,
      checked: getBoolean()
    },
    {
      name: 'Switch to luxe',
      cost: 80,
      checked: getBoolean()
    }
  ],

  [PointTypes.Ship.name]: [
    {
      name: 'Restaurant Entrance',
      cost: 200,
      checked: getBoolean()
    },
    {
      name: 'Massage Treatments',
      cost: 250,
      checked: getBoolean()
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
      checked: getBoolean()
    },
    {
      name: 'Switch to business',
      cost: 250,
      checked: getBoolean()
    }
  ],
};

function generateRandomWayPoint() {
  const randomPointType = getRandomArrayElement(Object.values(PointTypes));
  const [firstDate, secondDate] = generateRandomDate(2022, 2035);

  return ({
    type: randomPointType,
    destination: getRandomArrayElement(destinations),
    dates: {
      start: firstDate,
      end: secondDate
    },
    offers: offers[randomPointType.name],
    cost: generateRandomInteger(10, 1000),
    isFavorite: getBoolean()
  });
}

export {generateRandomWayPoint};
