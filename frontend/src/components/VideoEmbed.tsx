interface VideoEmbedProps {
  videoUrl: string;
  title?: string;
}

type VideoSource = 'youtube' | 'vimeo' | 'direct';

function detectVideoSource(url: string): VideoSource {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  return 'direct';
}

function getYouTubeEmbedUrl(url: string): string {
  // Handle youtube.com/watch?v=VIDEO_ID
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  // Handle youtu.be/VIDEO_ID
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  // Handle already embedded URL
  if (url.includes('youtube.com/embed')) {
    return url;
  }
  return url;
}

function getVimeoEmbedUrl(url: string): string {
  // Handle vimeo.com/VIDEO_ID
  if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
  }
  // Handle already embedded URL
  if (url.includes('player.vimeo.com')) {
    return url;
  }
  return url;
}

export default function VideoEmbed({ videoUrl, title }: VideoEmbedProps) {
  if (!videoUrl) {
    return (
      <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
        <div className="text-center text-white">
          <svg
            className="w-20 h-20 mx-auto mb-4 opacity-50"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
          <p className="text-lg font-medium">No video URL provided</p>
        </div>
      </div>
    );
  }

  const source = detectVideoSource(videoUrl);
  let embedUrl = videoUrl;

  if (source === 'youtube') {
    embedUrl = getYouTubeEmbedUrl(videoUrl);
  } else if (source === 'vimeo') {
    embedUrl = getVimeoEmbedUrl(videoUrl);
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-xl font-bold text-primary mb-4">{title}</h3>
      )}
      <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video">
        {source === 'direct' ? (
          <video
            src={embedUrl}
            controls
            className="w-full h-full"
            style={{ maxHeight: '100%' }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || 'Video player'}
          />
        )}
      </div>
    </div>
  );
}


