import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-semibold text-white/80 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white transition hover:scale-105"
          >
            ← Go Back Home
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white/80 transition hover:bg-white/10"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
