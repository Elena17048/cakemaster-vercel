
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, query, where, orderBy, limit, startAfter, Timestamp, getDoc, setDoc, getCountFromServer, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { Course, SizeOption, GalleryImage, Category, PopulatedGalleryImage, BannerSettings, GalleryImageUpdate, WeddingPageContent, CorporatePageContent, Order, OrderStatus } from '@/lib/types';

const coursesCollectionRef = collection(db, 'courses');
const sizesCollectionRef = collection(db, 'sizes');
const galleryCollectionRef = collection(db, 'gallery');
const categoriesCollectionRef = collection(db, 'categories');
const settingsCollectionRef = collection(db, 'site_settings');
const contentCollectionRef = collection(db, 'site_content');
const ordersCollectionRef = collection(db, 'orders');


// HELPERS
const deleteImageFromStorage = async (imageUrl: string) => {
    if (!imageUrl || !imageUrl.startsWith('gs://') && !imageUrl.startsWith('https://firebasestorage.googleapis.com')) return;
    try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
    } catch (error: any) {
        // It's okay if the image doesn't exist (e.g., already deleted)
        if (error.code !== 'storage/object-not-found') {
            console.error("Error deleting image from storage", error);
        }
    }
}


// COURSES API
export const getCourses = async (): Promise<Course[]> => {
    const data = await getDocs(coursesCollectionRef);
    return data.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        ...doc.data(),
        id: doc.id,
    })) as Course[];
};

export const addCourse = async (courseData: Omit<Course, 'id' | 'imageUrl'> & { imageUrl: string }) => {
    await addDoc(coursesCollectionRef, courseData);
};

export const updateCourse = async ({ id, courseData }: { id: string, courseData: Partial<Omit<Course, 'id'>> }) => {
    const courseDoc = doc(db, 'courses', id);
    await updateDoc(courseDoc, courseData);
};

export const deleteCourse = async (id: string) => {
    const courseDocRef = doc(db, 'courses', id);
    const docSnap = await getDoc(courseDocRef);
    if (docSnap.exists() && docSnap.data().imageUrl) {
        await deleteImageFromStorage(docSnap.data().imageUrl);
    }
    await deleteDoc(courseDocRef);
};

// SIZES API
export const getSizes = async (): Promise<SizeOption[]> => {
    const data = await getDocs(sizesCollectionRef);
    return data.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        label: doc.data().label,
        price: doc.data().price,
    })) as SizeOption[];
};

// CATEGORIES API
export const getCategories = async (): Promise<Category[]> => {
    const q = query(categoriesCollectionRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Category[];
};

export const addCategory = async (categoryData: Omit<Category, 'id' | 'order'>) => {
    const countQuery = query(categoriesCollectionRef);
    const countSnapshot = await getCountFromServer(countQuery);
    const newOrder = countSnapshot.data().count;

    await addDoc(categoriesCollectionRef, {
      ...categoryData,
      order: newOrder
    });
};

export const updateCategory = async ({ id, categoryData }: { id: string, categoryData: Partial<Omit<Category, 'id'>> }) => {
    const categoryDocRef = doc(db, 'categories', id);

    // If a new image is being uploaded, delete the old one first.
    if (categoryData.imageUrl) {
        const currentDoc = await getDoc(categoryDocRef);
        const currentData = currentDoc.data();
        if (currentData?.imageUrl && currentData.imageUrl !== categoryData.imageUrl) {
            await deleteImageFromStorage(currentData.imageUrl);
        }
    }

    await updateDoc(categoryDocRef, categoryData);
};


export const deleteCategory = async (id: string) => {
    const categoryDocRef = doc(db, 'categories', id);
    const docSnap = await getDoc(categoryDocRef);
    if (docSnap.exists() && docSnap.data().imageUrl) {
        await deleteImageFromStorage(docSnap.data().imageUrl);
    }
    await deleteDoc(categoryDocRef);
    // Note: Reordering after deletion can be complex, often better to handle in UI or a cloud function.
    // For now, we'll let gaps exist, which get handled on the next re-order.
};

export const updateCategoryOrder = async (orderedCategories: Category[]) => {
    const batch = writeBatch(db);
    orderedCategories.forEach((category, index) => {
        const categoryRef = doc(db, 'categories', category.id);
        batch.update(categoryRef, { order: index });
    });
    await batch.commit();
};


// GALLERY API
export const getGalleryCategoriesWithPreviews = async (): Promise<Category[]> => {
    return await getCategories();
};


type GetGalleryImagesParams = {
    categoryName?: string | null;
    categoryIds?: string[];
    categoryId?: string;
    page?: number;
    pageSize?: number;
    lastVisible?: QueryDocumentSnapshot<DocumentData>;
};

export const getGalleryImages = async (
    params: GetGalleryImagesParams
): Promise<{ images: PopulatedGalleryImage[]; totalCount: number; category: Category | null, lastVisible?: QueryDocumentSnapshot<DocumentData> }> => {
    const { categoryName, categoryIds, categoryId, pageSize = 9, lastVisible } = params;
    
    const categories = await getCategories();
    const categoriesMap = new Map<string, Category>(categories.map(c => [c.id, c]));

    let foundCategory: Category | null = null;
    let finalCategoryIds = categoryIds || [];

    if (categoryId) {
        const cat = categoriesMap.get(categoryId);
        if (cat) {
            foundCategory = cat;
            finalCategoryIds = [cat.id];
        } else {
            return { images: [], totalCount: 0, category: null, lastVisible: undefined };
        }
    } else if (categoryName) {
        for (const cat of categoriesMap.values()) {
            if (cat.name.en.toLowerCase() === categoryName.toLowerCase()) {
                foundCategory = cat;
                finalCategoryIds = [cat.id];
                break;
            }
        }
        if (!foundCategory) return { images: [], totalCount: 0, category: null, lastVisible: undefined };
    }

    const constraints = [orderBy('createdAt', 'desc')];
    if (finalCategoryIds.length > 0) {
        constraints.unshift(where('categories', 'array-contains-any', finalCategoryIds));
    }

    const countQuery = query(galleryCollectionRef, ...(finalCategoryIds.length > 0 ? [where('categories', 'array-contains-any', finalCategoryIds)] : []));
    const countSnapshot = await getCountFromServer(countQuery);
    const totalCount = countSnapshot.data().count;

    if (lastVisible) {
        constraints.push(startAfter(lastVisible));
    }
    constraints.push(limit(pageSize));

    const paginatedQuery = query(galleryCollectionRef, ...constraints);

    const snapshot = await getDocs(paginatedQuery);

    const images = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));

    const populatedImages = images.map(image => ({
        ...image,
        categories: image.categories ? image.categories.map(id => categoriesMap.get(id)).filter(Boolean) as Category[] : []
    })) as PopulatedGalleryImage[];
    
    const newLastVisible = snapshot.docs[snapshot.docs.length - 1];

    return { images: populatedImages, totalCount, category: foundCategory, lastVisible: newLastVisible };
};

export const addGalleryImage = async (imageData: Omit<GalleryImage, 'id' | 'createdAt'>) => {
    await addDoc(galleryCollectionRef, {
        ...imageData,
        createdAt: serverTimestamp()
    });
};

export const updateGalleryImage = async (id: string, imageData: GalleryImageUpdate) => {
    const imageDocRef = doc(db, 'gallery', id);
    const currentDoc = await getDoc(imageDocRef);
    const currentData = currentDoc.data();

    if (currentData?.imageUrl && currentData.imageUrl !== imageData.imageUrl) {
        await deleteImageFromStorage(currentData.imageUrl);
    }

    await updateDoc(imageDocRef, imageData);
};

export const deleteGalleryImage = async (id: string) => {
    const imageDocRef = doc(db, 'gallery', id);
    const docSnap = await getDoc(imageDocRef);
    if (docSnap.exists() && docSnap.data().imageUrl) {
        await deleteImageFromStorage(docSnap.data().imageUrl);
    }
    await deleteDoc(imageDocRef);
};


// STORAGE API
export const uploadCourseImage = async (imageFile: File): Promise<string> => {
    const storageRef = ref(storage, `course_images/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};

export const uploadGalleryImage = async (imageFile: File): Promise<string> => {
    const storageRef = ref(storage, `gallery/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(snapshot.ref);
};

export const uploadCategoryImage = async (imageFile: File): Promise<string> => {
    const storageRef = ref(storage, `category_images/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(snapshot.ref);
};

export const uploadWeddingImage = async (imageFile: File): Promise<string> => {
    const storageRef = ref(storage, `wedding_page/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(snapshot.ref);
};

export const deleteWeddingImage = async (imageUrl: string) => {
    return deleteImageFromStorage(imageUrl);
};

export const uploadCorporateImage = async (imageFile: File): Promise<string> => {
    const storageRef = ref(storage, `corporate_page/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(snapshot.ref);
};

export const deleteCorporateImage = async (imageUrl: string) => {
    return deleteImageFromStorage(imageUrl);
};


// SETTINGS API
export const getBannerSettings = async (): Promise<BannerSettings> => {
    const docRef = doc(settingsCollectionRef, 'banners');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as BannerSettings;
    }
    // Return default values if document doesn't exist
    return { showHalloweenBanner: false, showChristmasBanner: false };
};

export const updateBannerSettings = async (settings: Partial<BannerSettings>) => {
    const docRef = doc(settingsCollectionRef, 'banners');
    await setDoc(docRef, settings, { merge: true });
};

// WEDDING PAGE API
export const getWeddingPageContent = async (): Promise<WeddingPageContent> => {
    const docRef = doc(contentCollectionRef, 'weddings');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as WeddingPageContent;
    }
    // Return default/empty values if document doesn't exist
    return {
        reviews: [],
        galleryImages: [
            'https://picsum.photos/seed/wedding2/800/800',
            'https://picsum.photos/seed/wedding3/800/800',
            'https://picsum.photos/seed/wedding4/800/800'
        ]
    };
};

export const updateWeddingPageContent = async (content: Partial<WeddingPageContent>) => {
    const docRef = doc(contentCollectionRef, 'weddings');
    await setDoc(docRef, content, { merge: true });
};


// CORPORATE PAGE API
export const getCorporatePageContent = async (): Promise<CorporatePageContent> => {
    const docRef = doc(contentCollectionRef, 'corporate');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as CorporatePageContent;
    }
    // Return default/empty values if document doesn't exist
    return {
        reviews: [],
        galleryImages: [
            'https://picsum.photos/seed/corp1/800/800',
            'https://picsum.photos/seed/corp2/800/800',
            'https://picsum.photos/seed/corp3/800/800'
        ]
    };
};

export const updateCorporatePageContent = async (content: Partial<CorporatePageContent>) => {
    const docRef = doc(contentCollectionRef, 'corporate');
    await setDoc(docRef, content, { merge: true });
};

// ORDERS API
export const getOrders = async (): Promise<Order[]> => {
    const q = query(ordersCollectionRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Order[];
};

export const updateOrderStatus = async ({ orderId, status }: { orderId: string, status: OrderStatus }) => {
    const orderDoc = doc(db, 'orders', orderId);
    await updateDoc(orderDoc, { status });
};
