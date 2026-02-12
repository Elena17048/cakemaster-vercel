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
/* ===================== */
/* ADMIN – CATEGORIES */
/* ===================== */

import { addDoc, setDoc, deleteDoc } from "firebase/firestore";
import { uploadBytes, getDownloadURL } from "firebase/storage";

/* CATEGORY CRUD */

export const addCategory = async (data: Omit<Category, "id">) => {
  await addDoc(categoriesCollectionRef, data);
};

export const updateCategory = async (id: string, data: Partial<Category>) => {
  await updateDoc(doc(categoriesCollectionRef, id), data);
};

export const deleteCategory = async (id: string) => {
  await deleteDoc(doc(categoriesCollectionRef, id));
};

export const updateCategoryOrder = async (
  id: string,
  order: number
) => {
  await updateDoc(doc(categoriesCollectionRef, id), { order });
};

/* CATEGORY IMAGE */

export const uploadCategoryImage = async (
  file: File
): Promise<string> => {
  const storageRef = ref(
    storage,
    `categories/${Date.now()}_${file.name}`
  );

  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

/* ===================== */
/* ADMIN – COURSES */
/* ===================== */

export const addCourse = async (data: Omit<Course, "id">) => {
  await addDoc(coursesCollectionRef, data);
};

export const updateCourse = async (
  id: string,
  data: Partial<Course>
) => {
  await updateDoc(doc(coursesCollectionRef, id), data);
};

export const deleteCourse = async (id: string) => {
  await deleteDoc(doc(coursesCollectionRef, id));
};

export const uploadCourseImage = async (
  file: File
): Promise<string> => {
  const storageRef = ref(
    storage,
    `courses/${Date.now()}_${file.name}`
  );

  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

/* ===================== */
/* ADMIN – GALLERY */
/* ===================== */

export const addGalleryImage = async (
  data: Omit<GalleryImage, "id">
) => {
  await addDoc(galleryCollectionRef, data);
};

export const updateGalleryImage = async (
  id: string,
  data: Partial<GalleryImage>
) => {
  await updateDoc(doc(galleryCollectionRef, id), data);
};

export const deleteGalleryImage = async (id: string) => {
  await deleteDoc(doc(galleryCollectionRef, id));
};

export const uploadGalleryImage = async (
  file: File
): Promise<string> => {
  const storageRef = ref(
    storage,
    `gallery/${Date.now()}_${file.name}`
  );

  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

/* ===================== */
/* ADMIN – PAGE CONTENT */
/* ===================== */

export const updateWeddingPageContent = async (
  data: WeddingPageContent
) => {
  await setDoc(doc(contentCollectionRef, "weddings"), data);
};

export const updateCorporatePageContent = async (
  data: CorporatePageContent
) => {
  await setDoc(doc(contentCollectionRef, "corporate"), data);
};

/* ===================== */
/* ADMIN – BANNERS */
/* ===================== */

export const updateBannerSettings = async (
  data: BannerSettings
) => {
  await setDoc(doc(settingsCollectionRef, "banners"), data);
};
/* ===================== */
/* ADMIN – WEDDING IMAGES */
/* ===================== */

export const uploadWeddingImage = async (
  file: File
): Promise<string> => {
  const storageRef = ref(
    storage,
    `weddings/${Date.now()}_${file.name}`
  );

  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const deleteWeddingImage = async (
  imageUrl: string
) => {
  await deleteImageFromStorage(imageUrl);
};

/* ===================== */
/* ADMIN – CORPORATE IMAGES */
/* ===================== */

export const uploadCorporateImage = async (
  file: File
): Promise<string> => {
  const storageRef = ref(
    storage,
    `corporate/${Date.now()}_${file.name}`
  );

  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const deleteCorporateImage = async (
  imageUrl: string
) => {
  await deleteImageFromStorage(imageUrl);
};
