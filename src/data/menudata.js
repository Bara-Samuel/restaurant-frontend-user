import asun from "../assets/asun.png";
import ayamase from "../assets/ayamase.png";
import egusi from "../assets/egusi.png";
import friedRice from "../assets/fried_rice.jpg";
import kunu from "../assets/kunu.jpg";
import meatPie from "../assets/meatpie.jpg";
import chickenPie from "../assets/chicken_pie.jpg";
import chapman from "../assets/chapman.jpg";
import coconutRice from "../assets/coconut_rice.jpg";
import buns from "../assets/buns.jpg";
import afang from "../assets/afang.jpg";
import efoRiro from "../assets/efo-riro.jpg";
import ogbono from "../assets/ogbono.jpg";
import okra from "../assets/okra.jpg";
import palmWine from "../assets/palm-wine.jpg";
import puffPuff from "../assets/puff-puff.jpg";
import suya from "../assets/suya.jpg";
import turkey from "../assets/turkey.jpg";
import chicken from "../assets/chicken.jpg";
import zobo from "../assets/zobo.jpg";
import jollof from "../assets/jollof_rice.png";
import amala from "../assets/amala.png";

export const menuData = {
  rice: [
    {
      id: "rice-jollof",
      name: "Jollof Rice",
      category: "rice",
      price: 18.99,
      rating: 4.9,
      image: jollof,
      description:
        "Smoky Nigerian jollof rice cooked in rich tomato sauce with authentic spices.",
    },
    {
      id: "rice-ayamase",
      name: "White Rice & Ayamase",
      category: "rice",
      price: 20.99,
      rating: 4.8,
      image: ayamase,
      description:
        "Steamed white rice served with our signature spicy green pepper ayamase stew.",
    },
    {
      id: "rice-fried-rice",
      name: "Fried Rice",
      category: "rice",
      price: 17.99,
      rating: 4.7,
      image: friedRice,
      description:
        "Nigerian fried rice prepared with vegetables, liver, and aromatic spices.",
    },
    {
      id: "rice-coconut-rice",
      name: "Coconut Rice",
      category: "rice",
      price: 19.99,
      rating: 4.8,
      image: coconutRice,
      description:
        "Fragrant rice cooked in creamy coconut milk and blended Nigerian spices.",
    },
  ],

  soups: [
    {
      id: "soup-egusi",
      name: "Egusi Soup",
      category: "soups",
      price: 18.99,
      rating: 4.9,
      image: egusi,
      description:
        "Rich melon seed soup simmered with vegetables, assorted meats, and authentic spices.",
    },
    {
      id: "soup-ogbono",
      name: "Ogbono Soup",
      category: "soups",
      price: 17.99,
      rating: 4.8,
      image: ogbono,
      description:
        "Traditional draw soup made from wild mango seeds and assorted meats.",
    },
    {
      id: "soup-efo-riro",
      name: "Efo Riro",
      category: "soups",
      price: 18.99,
      rating: 4.8,
      image: efoRiro,
      description:
        "Flavorful spinach stew cooked with peppers, palm oil, and assorted meats.",
    },
    {
      id: "soup-afang",
      name: "Afang Soup",
      category: "soups",
      price: 19.99,
      rating: 4.9,
      image: afang,
      description:
        "A rich vegetable soup from Southern Nigeria packed with seafood and beef.",
    },
  ],

  swallow: [
    {
      id: "swallow-amala-ewedu",
      name: "Amala & Ewedu",
      category: "swallow",
      price: 18.99,
      rating: 4.8,
      image: amala,
      description:
        "Soft amala served with silky ewedu, gbegiri, and rich stew.",
    },
    {
      id: "swallow-pounded-yam-egusi",
      name: "Pounded Yam & Egusi",
      category: "swallow",
      price: 20.99,
      rating: 5.0,
      image: egusi,
      description:
        "Smooth pounded yam served with our signature egusi soup.",
    },
    {
      id: "swallow-eba-okra",
      name: "Eba & Okra",
      category: "swallow",
      price: 17.99,
      rating: 4.7,
      image: okra,
      description:
        "Fresh garri swallow served with delicious okra soup.",
    },
  ],

  grills: [
    {
      id: "grill-asun",
      name: "Asun",
      category: "grills",
      price: 16.99,
      rating: 4.9,
      image: asun,
      description:
        "Spicy grilled goat meat tossed in peppers, onions, and Nigerian seasoning.",
    },
    {
      id: "grill-suya",
      name: "Suya",
      category: "grills",
      price: 15.99,
      rating: 4.8,
      image: suya,
      description:
        "Tender beef skewers coated in authentic suya spice and grilled to perfection.",
    },
    {
      id: "grill-peppered-turkey",
      name: "Peppered Turkey",
      category: "grills",
      price: 17.99,
      rating: 4.8,
      image: turkey,
      description:
        "Juicy turkey bites sautéed in spicy pepper sauce.",
    },
    {
      id: "grill-peppered-chicken",
      name: "Peppered Chicken",
      category: "grills",
      price: 17.99,
      rating: 4.7,
      image: chicken,
      description:
        "Crispy fried chicken coated in our signature pepper sauce.",
    },
  ],

  pastries: [
    {
      id: "pastry-meat-pie",
      name: "Meat Pie",
      category: "pastries",
      price: 5.99,
      rating: 4.8,
      image: meatPie,
      description:
        "Golden flaky pastry filled with seasoned minced beef and potatoes.",
    },
    {
      id: "pastry-chicken-pie",
      name: "Chicken Pie",
      category: "pastries",
      price: 6.49,
      rating: 4.7,
      image: chickenPie,
      description:
        "Buttery pastry stuffed with tender chicken and vegetables.",
    },
    {
      id: "pastry-puff-puff",
      name: "Puff Puff",
      category: "pastries",
      price: 4.99,
      rating: 4.9,
      image: puffPuff,
      description:
        "Soft, fluffy fried dough balls lightly sweetened.",
    },
    {
      id: "pastry-buns",
      name: "Buns",
      category: "pastries",
      price: 4.49,
      rating: 4.6,
      image: buns,
      description:
        "Crunchy Nigerian buns with a soft, delicious center.",
    },
  ],

  drinks: [
    {
      id: "drink-zobo",
      name: "Zobo",
      category: "drinks",
      price: 4.99,
      rating: 4.8,
      image: zobo,
      description:
        "Refreshing hibiscus drink infused with pineapple, ginger, and cloves.",
    },
    {
      id: "drink-chapman",
      name: "Chapman",
      category: "drinks",
      price: 6.99,
      rating: 4.9,
      image: chapman,
      description:
        "Nigeria's iconic fruity mocktail with citrus and bitters.",
    },
    {
      id: "drink-palm-wine",
      name: "Palm Wine",
      category: "drinks",
      price: 7.99,
      rating: 4.7,
      image: palmWine,
      description:
        "Naturally fermented palm sap served chilled.",
    },
    {
      id: "drink-kunu",
      name: "Kunu",
      category: "drinks",
      price: 4.49,
      rating: 4.6,
      image: kunu,
      description:
        "Traditional millet drink blended with ginger and spices.",
    },
  ],
};