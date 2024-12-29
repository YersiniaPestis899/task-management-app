'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'AdapterError':
        return 'There was an issue connecting to the authentication service. This might be a temporary problem.';
      case 'AccessDenied':
        return 'Access was denied to your account. Please make sure you have the correct permissions.';
      case 'Verification':
        return 'The verification process failed. Please try again.';
      default:
        return 'An unexpected error occurred during authentication.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {getErrorMessage(error)}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Troubleshooting Steps
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc list-inside mt-2">
                    <li>Clear your browser cache and cookies</li>
                    <li>Try signing in with a different browser</li>
                    <li>Check your internet connection</li>
                    <li>If the problem persists, please try again later</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}