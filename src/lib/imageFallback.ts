import React from 'react';

// Reliable high-resolution Mediterranean seaside / cafe imagery fallbacks
export const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80';

export const FOOD_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80';

export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = FOOD_FALLBACK_IMAGE
) {
  const target = e.currentTarget;
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
