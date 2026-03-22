// src/data/bento.ts

export const BENTO_FLAVORS = [
  {
    id: "sicilie",
    name: "Sicílie",
    image: "/images/flavorsbento/sicilie.jpg",
    allergens: ["1", "3", "7", "8"],
  },
  {
    id: "provance",
    name: "Provance",
    image: "/images/flavorsbento/provance.jpg",
    allergens: ["1", "3", "7", "8"],
  },
  {
    id: "viden",
    name: "Vídeň",
    image: "/images/flavorsbento/viden.jpg",
    allergens: ["1", "3", "7"],
  },
  {
    id: "lisabon",
    name: "Lisabon",
    image: "/images/flavorsbento/lisabon.jpg",
    allergens: ["1", "3", "7"],
  },
  {
    id: "verona",
    name: "Verona",
    image: "/images/flavorsbento/verona.jpg",
    allergens: ["1", "3", "7"],
  },
];

export const BENTO_SIZES = {
  two: {
    label: "Pro 2 osoby",
    basePrice: 800,
    shapes: ["round", "star", "heart"],
  },
  three: {
    label: "Pro 3 osoby",
    basePrice: 900,
    shapes: ["square"],
  },
};


export const PLAQUE_PRICE = 50;
