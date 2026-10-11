const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80';

export function imageSource(source: string | null | undefined): string {
  return source?.trim() || FALLBACK_IMAGE;
}
