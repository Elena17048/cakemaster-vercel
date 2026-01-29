import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  DocumentData,
  QueryDocumentSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDoc,
  setDoc,
  getCountFromServer,
  writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
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

const coursesCollectionRef = collection(db, "courses");
const sizesCollectionRef = collection(db, "sizes");
const galleryCollectionRef = collection(db, "gallery");
const categoriesCollectionRef = collection(db, "categories");
const settingsCollectionRef = collection(db, "site_settings");
const contentCollectionRef = collection(db, "site_content");
const ordersCollectionRef = collection(db, "orders");

/* ===================== */
/* HELPERS */
/* ===================== */

const deleteImageFromStorage = async (imageUrl: string) => {
  if (
    !imageUrl ||
    (!imageUrl.startsWith("gs://") &&
      !imageUrl.startsWith("https://firebasestorage.googleapis.com"))
  )
    return;

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
  const data = await getDocs(coursesCollectionRef);
  return data.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Course[];
};

/* ===================== */
/* SIZES */
/* ===================== */

export const getSizes = async (): Promise<SizeOption[]> => {
  const data = await getDocs(sizesCollectionRef);
  return data.docs.map(doc => ({
    id: doc.id,
    label: doc.data().label,
    price: doc.data().price,
  })) as SizeOption[];
};

/* ===================== */
/* CATEGORIES */
/* ===================== */

export const getCategories = async (): Promise<Category[]> => {
  console.log("✅ getCategories CALLED on Vercel");

  const snapshot = await getDocs(categoriesCollectionRef);

  console.log("✅ categories count:", snapshot.size);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
};

/* ===================== */
/* 🖼️ GALLERY IMAGES API – DŮLEŽITÉ */
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
  const baseConstraints = [
    where("categories", "array-contains", categoryId),
    orderBy("createdAt", "desc"),
  ];

  const q = lastVisible
    ? query(
        galleryCollectionRef,
        ...baseConstraints,
        startAfter(lastVisible),
        limit(pageSize)
      )
    : query(
        galleryCollectionRef,
        ...baseConstraints,
        limit(pageSize)
      );

  const snapshot = await getDocs(q);

  const images = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
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

    // fallback – stránka se vždy vykreslí
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

export const getCorporatePageContent = async (): Promise<CorporatePageContent> => {
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

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
};

export const updateOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) => {
  await updateDoc(doc(db, "orders", orderId), { status });
};
