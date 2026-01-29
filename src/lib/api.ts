import {
  collection,
  getDocs,
  updateDoc,
  doc,
  DocumentData,
  QueryDocumentSnapshot,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import type {
  Course,
  SizeOption,
  GalleryImage,
  Category,
  BannerSettings,
  WeddingPageContent,
  CorporatePageContent,
  Order,
  OrderStatus,
} from "@/lib/types";

/* ===================== */
/* 🔑 FIRESTORE ROOT */
/* ===================== */

const rootDocRef = doc(db, "cakemaster", "cakemaster");

const categoriesCollectionRef = collection(rootDocRef, "categories");
const galleryCollectionRef = collection(rootDocRef, "gallery");
const settingsCollectionRef = collection(rootDocRef, "site_settings");
const contentCollectionRef = collection(rootDocRef, "site_content");
const ordersCollectionRef = collection(rootDocRef, "orders");
const coursesCollectionRef = collection(rootDocRef, "courses");
const sizesCollectionRef = collection(rootDocRef, "sizes");

/* ===================== */
/* HELPERS */
/* ===================== */

const deleteImageFromStorage = async (imageUrl: string) => {
  if (
    !imageUrl ||
    (!imageUrl.startsWith("gs://") &&
      !imageUrl.startsWith("https://firebasestorage.googleapis.com"))
  ) {
    return;
  }

  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error: any) {
    if (error.code !== "storage/object-not-found") {
      console.error("Error deleting image from storage", error);
    }
  }
};

/* ===================== */
/* SETTINGS / BANNERS */
/* ===================== */

export const getBannerSettings = async (): Promise<BannerSettings> => {
  try {
    const docRef = doc(settingsCollectionRef, "banners");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as BannerSettings;
    }

    return {
      showHalloweenBanner: false,
      showChristmasBanner: false,
    };
  } catch (error) {
    console.error("Failed to load banner settings:", error);
    return {
      showHalloweenBanner: false,
      showChristmasBanner: false,
    };
  }
};

/* ===================== */
/* COURSES */
/* ===================== */

export const getCourses = async (): Promise<Course[]> => {
  const snapshot = await getDocs(coursesCollectionRef);
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Course[];
};

/* ===================== */
/* SIZES */
/* ===================== */

export const getSizes = async (): Promise<SizeOption[]> => {
  const snapshot = await getDocs(sizesCollectionRef);
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    label: docSnap.data().label,
    price: docSnap.data().price,
  })) as SizeOption[];
};

/* ===================== */
/* CATEGORIES */
/* ===================== */

export const getCategories = async (): Promise<Category[]> => {
  const snapshot = await getDocs(categoriesCollectionRef);

  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Category[];
};

/* ===================== */
/* 🖼️ GALLERY IMAGES */
/* ===================== */

export const getGalleryImages = async ({
  categoryId,
  pageSize = 9,
  lastVisible,
}: {
  categoryId: string;
  pageSize?: number;
  lastVisible?: QueryDocumentSnapshot<DocumentData>;
}): Promise<{
  images: GalleryImage[];
  lastVisible?: QueryDocumentSnapshot<DocumentData>;
}> => {
  const baseQuery = [
    where("categories", "array-contains", categoryId),
    orderBy("createdAt", "desc"),
  ];

  const q = lastVisible
    ? query(
        galleryCollectionRef,
        ...baseQuery,
        startAfter(lastVisible),
        limit(pageSize)
      )
    : query(galleryCollectionRef, ...baseQuery, limit(pageSize));

  const snapshot = await getDocs(q);

  const images = snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as GalleryImage[];

  return {
    images,
    lastVisible: snapshot.docs[snapshot.docs.length - 1],
  };
};

/* ===================== */
/* WEDDINGS */
/* ===================== */

export const getWeddingPageContent = async (): Promise<WeddingPageContent> => {
  try {
    const docRef = doc(contentCollectionRef, "weddings");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as WeddingPageContent;
    }

    return {
      reviews: [],
      galleryImages: [],
    };
  } catch (error) {
    console.error("Failed to load wedding page content:", error);
    return {
      reviews: [],
      galleryImages: [],
    };
  }
};

/* ===================== */
/* CORPORATE */
/* ===================== */

export const getCorporatePageContent =
  async (): Promise<CorporatePageContent> => {
    try {
      const docRef = doc(contentCollectionRef, "corporate");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as CorporatePageContent;
      }

      return { reviews: [], galleryImages: [] };
    } catch (error) {
      console.error("Failed to load corporate page content:", error);
      return { reviews: [], galleryImages: [] };
    }
  };

/* ===================== */
/* ORDERS */
/* ===================== */

export const getOrders = async (): Promise<Order[]> => {
  const q = query(ordersCollectionRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Order[];
};

export const updateOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) => {
  await updateDoc(doc(ordersCollectionRef, orderId), { status });
};
