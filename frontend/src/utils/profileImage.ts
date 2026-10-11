export async function profileImageFileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Choose an image file');

  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Image could not be prepared');

    let imageBlob: Blob | null = null;
    for (const maxDimension of [900, 700, 500, 320]) {
      const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      for (const quality of [0.78, 0.65, 0.52, 0.4, 0.3]) {
        imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
        if (imageBlob && imageBlob.size <= 55 * 1024) break;
      }
      if (imageBlob && imageBlob.size <= 55 * 1024) break;
    }
    if (!imageBlob || imageBlob.size > 55 * 1024) throw new Error('Choose a smaller image');

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Image could not be read'));
      reader.onerror = () => reject(new Error('Image could not be read'));
      reader.readAsDataURL(imageBlob);
    });
  } finally {
    bitmap.close();
  }
}
