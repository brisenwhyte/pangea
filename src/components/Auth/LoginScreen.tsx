import React from 'react';
import { Wallet, AlertCircle, Loader } from 'lucide-react';

// Mock enhanced useAuth hook for demo
const useAuth = () => {
  const [authLoading, setAuthLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState(null);

  return {
    signInWithGoogle: async () => {
      console.log('Google Sign In clicked');
      setAuthLoading(true);
      setAuthError(null);
      
      // Simulate auth process
      setTimeout(() => {
        setAuthLoading(false);
        // Simulate error for demo
        // setAuthError('Authentication failed. Please try again.');
      }, 2000);
    },
    authLoading,
    authError,
    clearAuthError: () => setAuthError(null)
  };
};

const LoginScreen = () => {
  const { signInWithGoogle, authLoading, authError, clearAuthError } = useAuth();

  // Debug info
  const debugInfo = {
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    isTouchDevice: 'ontouchstart' in window,
    platform: navigator.platform,
    isOnline: navigator.onLine,
  };

  const handleSignIn = () => {
    console.log('Sign in button clicked');
    console.log('Debug info:', debugInfo);
    if (authError) {
      clearAuthError();
    }
    signInWithGoogle();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        {/* Main Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pangea</h1>
            <p className="text-gray-600">Your personal finance tracker</p>
          </div>

          <div className="space-y-6">
            <div className="text-left space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">Welcome!</h2>
              <p className="text-gray-600 text-sm">
                Track your expenses and income with ease. Get insights into your spending patterns and take control of your finances.
              </p>
            </div>

            {/* Error Alert */}
            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-red-700">{authError}</p>
                  <button
                    onClick={clearAuthError}
                    className="text-xs text-red-600 hover:text-red-800 mt-1"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              disabled={authLoading}
              className={`w-full bg-white border-2 border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium transition-all duration-200 flex items-center justify-center space-x-3 ${
                authLoading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50 hover:border-gray-400 active:scale-95'
              }`}
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              {authLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="text-xs text-gray-500 space-y-1">
              <p>By signing in, you agree to our Terms of Service</p>
              <p>and Privacy Policy</p>
            </div>
          </div>
        </div>

        {/* Debug Info Card - Remove in production */}
        <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-2">
          <h3 className="font-semibold text-gray-700 mb-2">Debug Info:</h3>
          <div className="space-y-1 text-gray-600">
            <p><strong>Screen:</strong> {debugInfo.screenSize}</p>
            <p><strong>Touch:</strong> {debugInfo.isTouchDevice ? 'Yes' : 'No'}</p>
            <p><strong>Platform:</strong> {debugInfo.platform}</p>
            <p><strong>Online:</strong> {debugInfo.isOnline ? 'Yes' : 'No'}</p>
            <p><strong>User Agent:</strong> {debugInfo.userAgent.substring(0, 50)}...</p>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-gray-500">Check browser console for detailed logs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;