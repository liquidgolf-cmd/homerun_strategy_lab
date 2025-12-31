export default function VideoPlaceholder() {
  return (
    <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-primary/20 rounded-xl overflow-hidden aspect-video shadow-2xl border-2 border-gray-700/50">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
        <div className="text-center relative z-10">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-primary/30">
              <svg
                className="w-12 h-12 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Introduction Video</h3>
          <p className="text-gray-300 text-base md:text-lg max-w-md mx-auto">
            Watch a brief overview of the Homerun Strategy Lab and learn how to get started on your journey to business clarity.
          </p>
        </div>
      </div>
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-pulse"></div>
    </div>
  );
}




