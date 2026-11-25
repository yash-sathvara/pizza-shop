import toppingPepperoni from '../assets/images/topping-pepperoni.png';
import toppingBasil from '../assets/images/topping-basil.png';
import toppingMozz from '../assets/images/topping-mozzarella.png';
import toppingChili from '../assets/images/topping-chili.png';

export const TOPPINGS = [
  {
    id: 'pepperoni',
    name: 'Pepperoni',
    price: 3,
    icon: toppingPepperoni,
    color: '#FF4E00',
  },
  {
    id: 'basil',
    name: 'Fresh basil',
    price: 2,
    icon: toppingBasil,
    color: '#22C55E',
  },
  {
    id: 'freshMozz',
    name: 'Fresh mozz',
    price: 3,
    icon: toppingMozz,
    color: '#FAF4E3',
  },
  {
    id: 'chiliFlakes',
    name: 'Chili flakes',
    price: 1,
    icon: toppingChili,
    color: '#EF4444',
  },
];

export const TOPPING_COORDINATES = {
  pepperoni: [
    { x: 30, y: 35, r: 15 },
    { x: 65, y: 28, r: -20 },
    { x: 48, y: 55, r: 40 },
    { x: 25, y: 65, r: -10 },
    { x: 72, y: 62, r: 30 },
    { x: 50, y: 30, r: -5 },
    { x: 36, y: 48, r: 25 },
  ],
  basil: [
    { x: 38, y: 40, r: 20 },
    { x: 60, y: 42, r: -35 },
    { x: 42, y: 65, r: 10 },
    { x: 55, y: 22, r: 45 },
    { x: 28, y: 52, r: -15 },
  ],
  freshMozz: [
    { x: 40, y: 30, r: 0 },
    { x: 58, y: 50, r: 10 },
    { x: 32, y: 58, r: -15 },
    { x: 62, y: 32, r: 25 },
  ],
  chiliFlakes: [
    { x: 45, y: 42, r: 12 },
    { x: 52, y: 38, r: -8 },
    { x: 35, y: 50, r: 35 },
    { x: 60, y: 58, r: -22 },
    { x: 48, y: 68, r: 18 },
  ],
};

