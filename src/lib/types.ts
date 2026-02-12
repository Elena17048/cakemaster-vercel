import { Timestamp } from "firebase/firestore";

/* ===================== */
/* ORDERS */
/* ===================== */

export type OrderStatus =
  | "new"
  | "awaiting_payment"
  | "paid"
  | "done";

export type Customer = {
  name?: string;
  email?: string;
  phone?: string;
};

export type Order = {
  id: string;

  // core
  status: OrderStatus;
  amount: number;

  // cake
  flavor: string;
  size: string;
  shape?: string;
  plaqueText?: string;

  // dates
  createdAt?: Timestamp;
  pickupDate?: string;

  // customer
  customer?: Customer;
};

/* ===================== */
/* COURSES */
/* ===================== */

export type Course = {
  id: string;
  title: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  createdAt?: Timestamp;
};

/* ===================== */
/* SIZES */
/* ===================== */

export type SizeOption = {
  id: string;
  label: string;
  price: number;
};

/* ===================== */
/* GALLERY */
/* ===================== */

export type GalleryImage = {
  id: string;
  imageUrl: string;
  categories: string[];
  createdAt?: Timestamp;
};

/* ===================== */
/* CATEGORIES */
/* ===================== */

export type Category = {
  id: string;
  name: string;
  createdAt?: Timestamp;
};

/* ===================== */
/* BANNERS */
/* ===================== */

export type BannerSettings = {
  showHalloweenBanner: boolean;
  showChristmasBanner: boolean;
};

/* ===================== */
/* REVIEWS */
/* ===================== */

export type Review = {
  id?: string;
  name?: string;
  text?: string;
  rating?: number;
};

/* ===================== */
/* WEDDINGS PAGE */
/* ===================== */

export type WeddingPageContent = {
  reviews: Review[];
  galleryImages: GalleryImage[];
};

/* ===================== */
/* CORPORATE PAGE */
/* ===================== */

export type CorporatePageContent = {
  reviews: Review[];
  galleryImages: GalleryImage[];
};
