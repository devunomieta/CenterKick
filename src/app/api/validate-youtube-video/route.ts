import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'MISSING_URL', message: 'Please provide a valid URL.' },
        { status: 400 }
      );
    }

    const cleanUrl = url.trim();

    // 1. Basic URL Syntax Parse
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
    } catch (_) {
      return NextResponse.json({
        valid: false,
        error: 'INVALID_URL',
        message: 'Invalid web address formatting. Please include http:// or https://'
      });
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const isYouTubeHost =
      hostname === 'youtube.com' ||
      hostname.endsWith('.youtube.com') ||
      hostname === 'youtu.be' ||
      hostname.endsWith('.youtu.be');

    if (!isYouTubeHost) {
      return NextResponse.json({
        valid: false,
        error: 'NOT_YOUTUBE',
        message: 'Video highlights must be YouTube links (youtube.com or youtu.be).'
      });
    }

    // 2. Check Channel / Handle Links
    const pathAndQuery = `${parsedUrl.pathname}${parsedUrl.search}`.toLowerCase();
    if (
      pathAndQuery.includes('/@') ||
      pathAndQuery.includes('/channel/') ||
      pathAndQuery.includes('/user/') ||
      pathAndQuery.includes('/c/')
    ) {
      return NextResponse.json({
        valid: false,
        error: 'CHANNEL_LINK',
        message: 'Channel links belong in the "My YouTube Channel" field below. Please enter a direct video highlight link.'
      });
    }

    // 3. Extract 11-Character Video ID
    let videoId: string | null = null;

    if (hostname.includes('youtu.be')) {
      const parts = parsedUrl.pathname.split('/').filter(Boolean);
      if (parts.length > 0 && parts[0].length === 11) {
        videoId = parts[0];
      }
    } else {
      // Check query param v=
      const vParam = parsedUrl.searchParams.get('v');
      if (vParam && vParam.length === 11) {
        videoId = vParam;
      } else {
        // Check /embed/ or /shorts/ or /v/
        const match = parsedUrl.pathname.match(/\/(?:embed|shorts|v)\/([a-zA-Z0-9_-]{11})/);
        if (match) {
          videoId = match[1];
        }
      }
    }

    if (!videoId || videoId.length !== 11) {
      return NextResponse.json({
        valid: false,
        error: 'INVALID_VIDEO_ID',
        message: 'Could not detect a valid YouTube video in this URL. Make sure it points to a specific video.'
      });
    }

    // 4. Check Live Video Existence via YouTube oEmbed Endpoint
    try {
      const oembedTarget = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const oembedRes = await fetch(oembedTarget, {
        signal: controller.signal,
        headers: { 'User-Agent': 'CenterKick-VideoValidator/1.0' }
      });
      clearTimeout(timeoutId);

      if (!oembedRes.ok) {
        return NextResponse.json({
          valid: false,
          error: 'DEAD_OR_PRIVATE_VIDEO',
          message: 'This YouTube video is deleted, private, or unavailable.'
        });
      }

      const oembedData = await oembedRes.json();
      return NextResponse.json({
        valid: true,
        videoId,
        title: oembedData.title || 'YouTube Video',
        author: oembedData.author_name || ''
      });
    } catch (fetchError: any) {
      // If oembed fetch fails/times out, fallback gracefully if videoId syntax is valid
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          valid: true,
          videoId,
          warning: 'Validation timeout, video ID accepted.'
        });
      }
      return NextResponse.json({
        valid: false,
        error: 'DEAD_OR_PRIVATE_VIDEO',
        message: 'Unable to verify YouTube video. Please ensure the video is public and accessible.'
      });
    }
  } catch (err: any) {
    console.error('YouTube Validation API Error:', err);
    return NextResponse.json(
      { valid: false, error: 'SERVER_ERROR', message: 'Video validation failed.' },
      { status: 500 }
    );
  }
}
