export default function VideoPlaceholder() {
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
        <p className="text-lg font-medium">Video Placeholder</p>
        <p className="text-sm opacity-75 mt-2">Instructional video will be embedded here</p>
      </div>
    </div>
  );
}



