import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}