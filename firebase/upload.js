// upload.js (React Native-compatible)
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { getStorage } from 'firebase/storage';

export const upload = async (uri, path, onProgress) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = (e) => reject(new TypeError('Network request failed'));
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const storage = getStorage();
  const fileRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(fileRef, blob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress); // Optional callback
      },
      (error) => {
        reject(error);
      },
      async () => {
        blob.close?.();
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};
