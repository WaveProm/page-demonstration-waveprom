// Single source for the media CDN origin, supplied by environment variable
// only - no hard-coded fallback:
//   .env.local  local override, out of git
//   Vercel      Settings > Environment Variables
export const MEDIA_CDN_ORIGIN = process.env.NEXT_PUBLIC_MEDIA_URL;
