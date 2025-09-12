// LoginScreen.tsx - Production version with debug capabilities
import React, { useState } from 'react';
import { Wallet, AlertCircle, Loader, Info, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth'; // Your actual useAuth hook

const LoginScreen: React.FC = () => {
  const { signInWithGoogle, authLoading, authError, clearAuthError } = useAuth();
  const [showDebugInfo, setShowDebugInfo] = useState(false); // Set to false for production

  // Comprehensive device and environment info
  const getEnvironmentInfo = () => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio,
      isTouchDevice: 'ontouchstart' in window,
      maxTouchPoints: navigator.maxTouchPoints,
      isOnline: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled,
      language: navigator.language,
      currentURL: window.location.href,
      origin: window.location.origin,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      isSecureContext: window.isSecureContext,
      localStorageSupported: (() => {
        try {
          const test = '__test__';
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch (e) {
          return false;
        }
      })(),
      sessionStorageSupported: (() => {
        try {
          const test = '__test__';
          sessionStorage.setItem(test, test);
          sessionStorage.removeItem(test);
          return true;
        } catch (e) {
          return false;
        }
      })(),
    };
  };

  const envInfo = getEnvironmentInfo();
  
  const getDeviceType = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (/android/.test(ua)) return 'Android';
    if (/iphone|ipad|ipod/.test(ua)) return 'iOS';
    if (/windows phone/.test(ua)) return 'Windows Phone';
    if (envInfo.isTouchDevice && parseInt(envInfo.screenSize.split('x')[0]) < 768) return 'Mobile (Generic)';
    return 'Desktop/Laptop';
  };

  const handleSignIn = async () => {
    console.log('🖱️ Sign in button clicked');
    console.log('📊 Environment Info:', envInfo);
    console.log('📱 Device Type:', getDeviceType());
    
    if (authError) {
      clearAuthError();
    }
    
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('❌ Sign in failed:', error);
    }
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
                touchAction: 'manipulation',
                minHeight: '44px' // Ensure minimum tap target size for mobile
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

        {/* Debug Info Toggle - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <div className="text-center">
              <button
                onClick={() => setShowDebugInfo(!showDebugInfo)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showDebugInfo ? 'Hide' : 'Show'} Debug Info
              </button>
            </div>

            {/* Debug Info Panel */}
            {showDebugInfo && (
              <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-4">
                <h3 className="font-semibold text-gray-700">Debug Information</h3>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-600">Device & Browser</h4>
                  <div className="grid grid-cols-2 gap-2 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Info className="w-3 h-3 text-blue-500" />
                      <span>Device: {getDeviceType()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {envInfo.isTouchDevice ? 
                        <CheckCircle className="w-3 h-3 text-green-500" /> : 
                        <XCircle className="w-3 h-3 text-red-500" />
                      }
                      <span>Touch: {envInfo.isTouchDevice ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {envInfo.isOnline ? 
                        <CheckCircle className="w-3 h-3 text-green-500" /> : 
                        <XCircle className="w-3 h-3 text-red-500" />
                      }
                      <span>Online: {envInfo.isOnline ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {envInfo.isSecureContext ? 
                        <CheckCircle className="w-3 h-3 text-green-500" /> : 
                        <XCircle className="w-3 h-3 text-red-500" />
                      }
                      <span>HTTPS: {envInfo.isSecureContext ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-gray-500 space-y-1">
                  <p><strong>URL:</strong> {envInfo.currentURL}</p>
                  <p><strong>Screen:</strong> {envInfo.screenSize}</p>
                  <p><strong>User Agent:</strong> {envInfo.userAgent.substring(0, 50)}...</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 text-gray-500">
                  <p>📱 Mobile devices use redirect flow</p>
                  <p>🖥️ Desktop uses popup flow</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;