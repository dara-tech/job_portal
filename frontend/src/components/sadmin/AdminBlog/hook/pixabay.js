import axios from 'axios';

const PIXABAY_API_KEY = '42548888-b74d89ffeb78c353ecc4778a4';
const PIXABAY_API_URL = 'https://pixabay.com/api/';

export const searchPixabayImages = async (query, options = {}) => {
  if (!query) return [];

  const defaultOptions = {
    page: 1,
    per_page: 20,
    image_type: 'photo',
    orientation: 'all',
    lang: 'en',
    safesearch: true,
    order: 'popular'
  };

  const params = {
    key: PIXABAY_API_KEY,
    q: encodeURIComponent(query),
    ...defaultOptions,
    ...options
  };

  try {
    const response = await axios.get(PIXABAY_API_URL, { params });

    if (response.data.hits) {
      return response.data.hits;
    } else {
      console.error('No images found');
      return [];
    }
  } catch (error) {
    console.error('Error fetching images from Pixabay:', error);
    return [];
  }
};

export const getImageUrl = (image, size = 'webformatURL') => {
  return image[size];
};

export const getImageAltDescription = (image) => {
  return image.tags || 'Pixabay image';
};

export const getPixabayLink = (image) => {
  return image.pageURL;
};

export const getImageDetails = (image) => {
  return {
    id: image.id,
    pageURL: image.pageURL,
    type: image.type,
    tags: image.tags,
    previewURL: image.previewURL,
    previewWidth: image.previewWidth,
    previewHeight: image.previewHeight,
    webformatURL: image.webformatURL,
    webformatWidth: image.webformatWidth,
    webformatHeight: image.webformatHeight,
    largeImageURL: image.largeImageURL,
    fullHDURL: image.fullHDURL,
    imageURL: image.imageURL,
    imageWidth: image.imageWidth,
    imageHeight: image.imageHeight,
    imageSize: image.imageSize,
    views: image.views,
    downloads: image.downloads,
    likes: image.likes,
    comments: image.comments,
    user_id: image.user_id,
    user: image.user,
    userImageURL: image.userImageURL
  };
};
