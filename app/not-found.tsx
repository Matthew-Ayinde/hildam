// pages/404.js
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gradient-to-br w-full from-orange-500 via-[#ffffff] to-orange-500 flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-white drop-shadow-lg animate-bounce">
          404
        </h1>
        <p className="mt-6 text-2xl md:text-3xl text-gray-800 font-semibold">
          Oops! Page not found.
        </p>
        <p className="mt-4 text-gray-600 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link href="/" className="px-6 py-3 text-lg font-medium text-white bg-gray-900 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-all">
              Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
