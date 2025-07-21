import { BASE_URL } from '../utils/apiPaths';

// Upload a photo to Cloudinary via backend
export async function uploadTrainerPhoto(file) {
  const formData = new FormData();
  formData.append('photo', file);

  const res = await fetch(`${BASE_URL}/api/v1/trainers/upload-photo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
      // Note: Do NOT set Content-Type header for FormData; browser will set it
    },
    body: formData
  });
  if (!res.ok) throw new Error('Failed to upload photo');
  const data = await res.json();
  return data.url; // The backend should return { url: 'https://cloudinary/...' }
}
