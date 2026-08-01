import cook from '../assets/cook.png';
import delivery from '../assets/delivery.png';
import organic from '../assets/organic.jpg';
import { FaShoppingCart, FaLeaf, FaCrown, FaStar}from "react-icons/fa";
import { GiChefToque, GiFoodTruck } from "react-icons/gi";
// ABOUT PAGE
export const features = [
    {
        id:1,
        title:"Instant Delivery",
        text:"30-minute delivery guarantee in metro areas",
        icon: FaShoppingCart,
        img: delivery,
    },

      {
        id:2,
        title:"Master Chefs",
        text:"Michelin-star trained culinary experts",
        icon: GiChefToque,
        img: cook,
    },

    {
        id:3,
        title: "Premium Quality",
        text: "Locally sourced organic ingredients",
        icon: FaLeaf,
        img: organic,
    },

];

export const stats = [
  {
    number: "25K+",
    label: "Satisfied Guests",
    subtext: "Memorable dining experiences served with excellence",
    icon: FaCrown,
    gradient: "from-amber-300 via-yellow-500 to-amber-700",
  },

  {
    number: "4.9★",
    label: "Guest Rating",
    subtext: "Thousands of five-star reviews",
    icon: FaStar,
    gradient: "from-yellow-300 via-amber-500 to-orange-600",
  },

  {
    number: "30 Min",
    label: "Express Delivery",
    subtext: "Fresh, hot meals delivered to your door",
    icon: GiFoodTruck,
    gradient: "from-emerald-300 via-green-500 to-emerald-700",
  },

  {
    number: "100%",
    label: "Premium Ingredients",
    subtext: "Freshly sourced every single day",
    icon: FaLeaf,
    gradient: "from-lime-300 via-emerald-500 to-green-700",
  },
];