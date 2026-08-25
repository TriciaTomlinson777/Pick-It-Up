"use client";

const WATERMARK_TEXT = 'PickItUpSeattle.org';
const MAX_SINGLE_DIMENSION = 1600;
const COMBINED_WIDTH = 1080;
const COMBINED_HEIGHT = 1350;

async function loadImageElement(url) {
  // Fetch as a blob first so the canvas never taints on cross-origin photo hosts,
  // which otherwise silently blanks the photo and leaves only the watermark text.
  const response = await fetch(url);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  try {
    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Unable to load image for sharing.'));
      image.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function drawCover(context, image, x, y, width, height) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const boxRatio = width / height;

  let sx = 0;
  let sy = 0;
  let sWidth = image.naturalWidth;
  let sHeight = image.naturalHeight;

  if (imageRatio > boxRatio) {
    sWidth = image.naturalHeight * boxRatio;
    sx = (image.naturalWidth - sWidth) / 2;
  } else {
    sHeight = image.naturalWidth / boxRatio;
    sy = (image.naturalHeight - sHeight) / 2;
  }

  context.drawImage(image, sx, sy, sWidth, sHeight, x, y, width, height);
}

function drawWatermark(context, canvasWidth, canvasHeight) {
  const maxTextWidth = canvasWidth * 0.8;
  let fontSize = Math.max(16, Math.round(canvasWidth * 0.026));

  context.font = `600 ${fontSize}px -apple-system, "Segoe UI", sans-serif`;
  let textWidth = context.measureText(WATERMARK_TEXT).width;

  while (textWidth > maxTextWidth && fontSize > 11) {
    fontSize -= 1;
    context.font = `600 ${fontSize}px -apple-system, "Segoe UI", sans-serif`;
    textWidth = context.measureText(WATERMARK_TEXT).width;
  }

  const bottomOffset = Math.round(fontSize * 1.6);

  context.save();
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.shadowColor = 'rgba(0, 0, 0, 0.4)';
  context.shadowBlur = Math.round(fontSize * 0.6);
  context.fillStyle = 'rgba(255, 255, 255, 0.5)';
  context.fillText(WATERMARK_TEXT, canvasWidth / 2, canvasHeight - bottomOffset);
  context.restore();
}

async function composeWatermarkedCanvas(urls) {
  const images = await Promise.all(urls.map(loadImageElement));
  const canvas = document.createElement('canvas');

  if (images.length === 1) {
    const [image] = images;
    const scale = Math.min(1, MAX_SINGLE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);

    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    drawWatermark(context, canvas.width, canvas.height);
    return canvas;
  }

  canvas.width = COMBINED_WIDTH;
  canvas.height = COMBINED_HEIGHT;
  const context = canvas.getContext('2d');
  const bandHeight = COMBINED_HEIGHT / 2;

  drawCover(context, images[0], 0, 0, COMBINED_WIDTH, bandHeight);
  drawCover(context, images[1], 0, bandHeight, COMBINED_WIDTH, bandHeight);

  context.fillStyle = 'rgba(255, 255, 255, 0.9)';
  context.fillRect(0, bandHeight - 2, COMBINED_WIDTH, 4);

  drawWatermark(context, canvas.width, canvas.height);
  return canvas;
}

function canvasToBlob(canvas, type = 'image/jpeg', quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Unable to export the watermarked photo.'));
      }
    }, type, quality);
  });
}

export async function createWatermarkedShareFile(urls, filename = 'pickitupseattle-share.jpg') {
  const canvas = await composeWatermarkedCanvas(urls);
  const blob = await canvasToBlob(canvas);
  return new File([blob], filename, { type: 'image/jpeg' });
}

export async function shareFileToInstagram(file) {
  if (typeof navigator === 'undefined') {
    return { shared: false, reason: 'unsupported' };
  }

  const shareData = { files: [file] };

  if (typeof navigator.canShare !== 'function' || !navigator.canShare(shareData) || typeof navigator.share !== 'function') {
    return { shared: false, reason: 'unsupported' };
  }

  try {
    await navigator.share(shareData);
    return { shared: true };
  } catch (error) {
    if (error?.name === 'AbortError') {
      return { shared: false, reason: 'cancelled' };
    }
    throw error;
  }
}

export function downloadShareFile(file) {
  const objectUrl = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
}
