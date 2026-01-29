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
  status: OrderStatus;
  amount: number;

  flavor: string;
  size: string;
  shape?: string;
  plaqueText?: string;

  createdAt?: Timestamp;
  pickupDate?: string;

  customer?: Customer;
};

/* ===================== */
/* COURSES */
/* ===================== */

export type Course = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
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
/* CATEGORIES */
/* ===================== */

export type Category = {
  id: string;
  name: {
    cs: string;
    en: string;
  };
  description?: {
    cs?: string;
    en?: string;
  };
  imageUrl?: string;
  order?: number;
};

/* ===================== */
/* GALLERY */
/* ===================== */

export type GalleryImage = {
  id: string;
  imageUrl: string;
  categories?: string[];
  createdAt?: Timestamp;
};

export type PopulatedGalleryImage = GalleryImage & {
  categories: Category[];
};

export type GalleryImageUpdate = Partial<Omit<GalleryImage, "id">>;

/* ===================== */
/* SITE SETTINGS */
/* ===================== */

export type BannerSettings = {
  showHalloweenBanner: boolean;
  showChristmasBanner: boolean;
};

/* ===================== */
/* CONTENT PAGES */
/* ===================== */

export type Review = {
  id: string;
  name: string;
  text: {
    cs?: string;
    en?: string;
  };
};

export type WeddingPageContent = {
  reviews: Review[];
  galleryImages: string[];
};

export type CorporatePageContent = {
  reviews: Review[];
  galleryImages: string[];
};
