import * as ImagePicker from 'expo-image-picker';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/di6dfkh3b/image/upload';
const UPLOAD_PRESET = 'ml_default';

async function uploadSingleImageToCloudinary(imageFromDevice) {
  try {
    if (!imageFromDevice || !imageFromDevice.uri) {
      throw new Error('No image selected');
    }

    const fileExtension = imageFromDevice.uri.split('.').pop().toLowerCase();
    const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';

    const data = new FormData();
    data.append('file', {
      uri: imageFromDevice.uri,
      type: mimeType,
      name: `upload.${fileExtension}`,
    });
    data.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: data,
    });

    const result = await response.json();

    if (result.secure_url) {
      return result.secure_url;
    } else {
      throw new Error(result?.error?.message || 'Failed to upload image to Cloudinary');
    }
  } catch (error) {
    console.error('Single image upload error:', error);
    throw error;
  }
}

async function pickImageFromLibrary() {
  // Request permissions
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (perm.status !== 'granted') {
    throw new Error('Permission to access media library was denied');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.9,
    allowsEditing: true,
    aspect: [1, 1],
  });

  if (result.canceled) return null;

  const asset = result.assets?.[0];
  return asset ? { uri: asset.uri } : null;
}

export const imageUploadService = {
  uploadSingleImageToCloudinary,
  pickImageFromLibrary,
  async pickAndUpload() {
    const image = await pickImageFromLibrary();
    if (!image) return null;
    return await uploadSingleImageToCloudinary(image);
  },
};
