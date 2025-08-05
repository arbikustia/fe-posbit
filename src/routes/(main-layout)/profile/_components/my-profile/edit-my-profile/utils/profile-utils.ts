import type Cropper  from 'cropperjs';

export async function loadCropper(): Promise<typeof Cropper> {
  try {
    await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css');
    
    const response = await fetch(
      'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js'
    );
    const cropperCode = await response.text();
    
    const script = document.createElement('script');
    script.textContent = cropperCode;
    document.head.appendChild(script);

    return new Promise((resolve) => {
      const checkCropper = () => {
        if (window.Cropper) {
          resolve(window.Cropper);
        } else {
          setTimeout(checkCropper, 100);
        }
      };
      checkCropper();
    });
  } catch (error) {
    console.error('Failed to load Cropper.js:', error);
    throw error;
  }
}

async function loadCSS(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existingLink = document?.querySelector(`link[href="${url}"]`);
    if (existingLink) return resolve();

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
    document.head.appendChild(link);
  });
}