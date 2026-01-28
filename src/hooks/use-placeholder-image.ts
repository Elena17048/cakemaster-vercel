
import placeholderData from '@/lib/placeholder-images.json';

export type PlaceholderKey = keyof typeof placeholderData;

export const usePlaceholderImage = () => {
    return placeholderData;
};
