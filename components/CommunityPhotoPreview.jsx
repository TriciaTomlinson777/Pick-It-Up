import NextImage from 'next/image';
import { canOptimizePublicPhoto } from '@/lib/photo-preview-policy';

export default function CommunityPhotoPreview({ src, alt, sizes = '(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 600px', ...props }) {
  if (!canOptimizePublicPhoto(src)) {
    return <img {...props} src={src} alt={alt} loading="lazy" decoding="async" />;
  }

  return (
    <NextImage
      {...props}
      src={src}
      alt={alt}
      width={1600}
      height={1600}
      sizes={sizes}
      loading="lazy"
      decoding="async"
    />
  );
}
