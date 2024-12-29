import Link from 'next/link';

interface ErrorPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ErrorPage({
  searchParams,
}: ErrorPageProps) {
  const error = searchParams.error as string | null;

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please try again later.';
      case 'AccessDenied':
        return 'You do not have permission to access this resource.';
      case 'Verification':
        return 'The verification link may have expired or has already been used.';
      case 'AdapterError':
        return 'There was an issue with the authentication service. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
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
        
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error Details
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Please try the following:
                </p>
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
  );
}