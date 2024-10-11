import { createApi } from 'unsplash-js';

// Initialize the Unsplash API client
const unsplash = createApi({
  accessKey: 'RCcSLUWcbRPQlUaS7Kly5FLjy-CuMliPnYaHgtaiI2E'
});

export const searchUnsplashImages = async (query, page = 1, perPage = 10) => {
  if (!query) return [];

  try {
    const result = await unsplash.search.getPhotos({
      query,
      page,
      perPage,
      orientation: 'landscape'
    });

    if (result.errors) {
      console.error('Error fetching images:', result.errors[0]);
      return [];
    } else {
      return result.response.results;
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const getImageUrl = (image, size = 'small') => {
  return image.urls[size];
};

export const getImageAltDescription = (image) => {
  return image.alt_description || 'Unsplash image';
};

export const getUnsplashLink = (image) => {
  return image.links.html;
};