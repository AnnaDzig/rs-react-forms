export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Failed to convert image'));
    });

    reader.addEventListener('error', () => {
      reject(new Error('Failed to read image'));
    });

    reader.readAsDataURL(file);
  });
}
