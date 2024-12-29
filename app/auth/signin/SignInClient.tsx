'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

interface SignInClientProps {
  defaultCallbackUrl: string;
}

export default function SignInClient({ defaultCallbackUrl }: SignInClientProps) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || defaultCallbackUrl;
  const error = searchParams.get('error');

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Authentication Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>An error occurred during sign in. Please try again.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleGoogleSignIn}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Sign in with Google
      </button>
    </div>
  );
}