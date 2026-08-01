import asun from "../assets/asun.png";
import ayamase from "../assets/ayamase.png";
import banner from "../assets/banner.png";
import crown from "../assets/crown.png";
import egusi from "../assets/egusi.png";
import customer_1 from "../assets/customer_1.jpeg";
import eko_logo from "../assets/eko_logo.jpeg";
import jollof from "../assets/jollof_rice.png";
import pastries from "../assets/pastries.png";
import knife from "../assets/knife.png";
import fork from "../assets/fork.png";
import table_food from "../assets/table_food_1.jpeg";
import danfo from "../assets/danfo_joy.png";
import eko_center from "../assets/eko_center.png";
import eko_video from "../assets/eko_video2.mp4";
import amala from "../assets/amala.png";

import { FaFacebook, FaInstagram, FaUtensils } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { FiHome, FiUser, FiPhone, FiMail, FiMessageSquare } from "react-icons/fi";

// =========================
// Images
// =========================

export const images = {
  ayamase,
  banner,
  crown,
  egusi,
  customer_1,
  eko_logo,
  jollof,
  pastries,
  knife,
  fork,
  table_food,
  danfo,
  asun,
  eko_center,
  eko_video,
  amala,
};

// =========================
// Social Media
// =========================

export const socialIcons = [
  {
    id: "social-facebook",
    icon: FaFacebook,
    link: "https://facebook.com/ekorestaurantlounge",
    color: "#1877F2",
    label: "Facebook",
  },
  {
    id: "social-instagram",
    icon: FaInstagram,
    link: "https://www.instagram.com/ekorestaurantlounge/",
    color: "#E1306C",
    label: "Instagram",
  },
  {
    id: "social-tiktok",
    icon: FaTiktok,
    link: "https://www.tiktok.com/@ekorestaurantlounge",
    color: "#25F4EE",
    label: "TikTok",
  },
];

// =========================
// Navigation
// =========================

export const navLinks = [
  {
    id: "nav-home",
    title: "Home",
    path: "/",
  },
  {
    id: "nav-about",
    title: "About",
    path: "/about",
  },
  {
    id: "nav-menu",
    title: "Menu",
    path: "/menu",
  },
  {
    id: "nav-delivery",
    title: "Delivery",
    path: "/delivery",
  },
  {
    id: "nav-contact",
    title: "Contact",
    path: "/contact",
  },
];

// =========================
// Restaurant Information
// =========================

export const restaurantInfo = {
  name: "EKO Restaurant & Lounge",

  slogan: "African Excellence Served on Every Plate.",

  heroDescription:
    "Experience the rich flavors and vibrant culture of Africa in a refined setting, where every dish is crafted with elegance and every visit becomes an unforgettable memory.",

  bannerTitle: "African Excellence Served in a Dish.",

  bannerDescription:
    "Every plate tells a story of culture, flavor, and tradition. From the first aroma to the final bite, our dishes are crafted to create unforgettable memories.",

  phone: "(555) 123-4567",

  email: "info@ekorestaurant.com",

  address: "123 Main Street, Houston, Texas",

  openingHours: {
    monday: "11:00 AM - 10:00 PM",
    tuesday: "11:00 AM - 10:00 PM",
    wednesday: "11:00 AM - 10:00 PM",
    thursday: "11:00 AM - 10:00 PM",
    friday: "11:00 AM - 11:00 PM",
    saturday: "11:00 AM - 11:00 PM",
    sunday: "12:00 PM - 9:00 PM",
  },

  socials: {
    instagram: "https://www.instagram.com/ekorestaurantlounge/",
    facebook: "https://facebook.com/ekorestaurantlounge",
    tiktok: "https://www.tiktok.com/@ekorestaurantlounge",
  },

  uberEats: "https://www.ubereats.com/",
  doordash: "https://www.doordash.com/",
  grubhub: "https://www.grubhub.com/",
};

// =========================
// Additional / Hot Menu Items
// =========================

export const additionalData = [
  {
    id: "offer-jollof-rice",
    name: "Jollof Rice",
    price: 21.0,
    category: "Rice",
    image: jollof,
    rating: 4.9,
    hearts: 420,
    description:
      "Smoky Nigerian jollof rice slow-cooked in tomato sauce with aromatic spices.",
    featured: true,
  },
  {
    id: "offer-egusi-soup",
    name: "Egusi Soup",
    price: 18.0,
    category: "Soup",
    image: egusi,
    rating: 4.8,
    hearts: 365,
    description:
      "Rich melon-seed soup prepared with leafy vegetables, assorted meat, and traditional seasonings.",
    featured: true,
  },
  {
    id: "offer-white-rice-ayamase",
    name: "White Rice & Ayamase",
    price: 25.0,
    category: "Rice",
    image: ayamase,
    rating: 4.9,
    hearts: 398,
    description:
      "Fluffy white rice served with spicy green-pepper ayamase stew and savory proteins.",
    featured: true,
  },
  {
    id: "offer-asun-stew",
    name: "Asun Stew",
    price: 22.0,
    category: "Grills",
    image: asun,
    rating: 4.7,
    hearts: 284,
    description:
      "Tender grilled goat meat tossed with peppers, onions, and bold Nigerian spices.",
    featured: true,
  },
  {
    id: "offer-nigerian-pastries",
    name: "Nigerian Pastries",
    price: 12.0,
    category: "Pastries",
    image: pastries,
    rating: 4.6,
    hearts: 246,
    description:
      "A delightful selection of freshly baked and fried Nigerian pastry favorites.",
    featured: true,
  },
];

// =========================
// Popular Recipes / Specials
// =========================

export const cartData = [
  {
    id: "special-jollof-rice",
    name: "Jollof Rice",
    price: 20.79,
    category: "Rice",
    description:
      "A rich, smoky rice dish slow-cooked with Nigerian spices and bursting with bold West African flavor.",
    image: jollof,
    rating: 4.8,
    hearts: 548,
  },
  {
    id: "special-egusi-soup",
    name: "Egusi Soup",
    price: 17.97,
    category: "Soup",
    description:
      "A hearty melon-seed soup simmered with leafy vegetables, premium meats, and traditional spices.",
    image: egusi,
    rating: 4.6,
    hearts: 285,
  },
  {
    id: "special-white-rice-ayamase",
    name: "White Rice & Ayamase",
    price: 21.26,
    category: "Rice",
    description:
      "White rice paired with signature spicy ayamase stew and a flavorful selection of proteins.",
    image: ayamase,
    rating: 4.9,
    hearts: 325,
  },
  {
    id: "special-amala-ewedu",
    name: "Amala & Ewedu",
    price: 22.35,
    category: "Swallow",
    description:
      "A beloved Yoruba delicacy featuring soft amala, silky ewedu soup, gbegiri, and flavorful stew.",
    image: amala,
    rating: 4.3,
    hearts: 267,
  },
];

// =========================
// Testimonials
// =========================

export const testimonials = [
  {
    id: "testimonial-jake-tommy",
    name: "Jake Tommy",
    location: "New York, USA",
    review:
      "This is my fifth time here. The egusi was rich and satisfying, and the jollof rice was perfectly seasoned. Definitely coming back.",
    rating: 5,
  },
  {
    id: "testimonial-sarah-johnson",
    name: "Sarah Johnson",
    location: "Dallas, Texas",
    review:
      "One of the best African restaurants I've ever visited. Beautiful atmosphere and incredible food.",
    rating: 5,
  },
  {
    id: "testimonial-david-brown",
    name: "David Brown",
    location: "Houston, Texas",
    review:
      "Amazing customer service. Every dish tasted authentic and fresh.",
    rating: 5,
  },
];

// =========================
// Login Styles
// =========================

export const inputBase =
  "w-full rounded-lg bg-[#2D1B0E] text-green-100 placeholder-green-400 focus:outline-none focus:ring-2";

export const iconClass =
  "absolute top-1/2 -translate-y-1/2 left-3 text-green-400";

// =========================
// Footer
// =========================

export const footerLinks = [
  {
    title: "Company",
    links: [
      {
        name: "Home",
        path: "/",
      },
      {
        name: "About",
        path: "/about",
      },
      {
        name: "Menu",
        path: "/menu",
      },
      {
        name: "Contact",
        path: "/contact",
      },
    ],
  },
  {
    title: "Support",
    links: [
      {
        name: "Privacy Policy",
        path: "/privacy",
      },
      {
        name: "Terms & Conditions",
        path: "/terms",
      },
      {
        name: "FAQs",
        path: "/faq",
      },
    ],
  },
  {
    title: "Ordering",
    links: [
      {
        name: "Pickup",
        path: "/pickup",
      },
      {
        name: "Delivery",
        path: "/delivery",
      },
      {
        name: "Reservations",
        path: "/reservation",
      },
    ],
  },
];

export const contactFormFields = [
  {label: 'Full Name', name:'name', type:'text', placeholder:'Enter your full name', Icon:FiUser},
  {label: 'Phone Number', name:'phone', type:'tel', placeholder:'Enter your phone number', pattern: "[+]{0,1}[0-9]{10,13}",  Icon:FiPhone},
  {label: 'Email Address', name:'email', type:'email', placeholder:'Enter your email address',Icon:FiMail},
  {label: 'Address', name:'address', type:'text', placeholder:'Enter your address', Icon:FiHome},
  {label: 'Dish Name', name:'dish', type:'text', placeholder:'Enter the dish name (if applicable)', Icon:FaUtensils},
  {label: 'Query / Message', name:'query', type:'textarea', placeholder:'Enter your query or message here...', Icon:FiMessageSquare},
];