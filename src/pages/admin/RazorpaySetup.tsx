import { useState, useEffect } from 'react';
import { razorpayDiagnostics } from '../../utils/razorpayDiagnostics';
import { Button } from '../../components/common/Button';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export function RazorpaySetup() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runDiagnostics = async () => {
    setTesting(true);
    setResults(null);

    try {
      const status = await razorpayDiagnostics.getSetupStatus();
      setResults(status);
      
      // Also log to console for detailed view
      await razorpayDiagnostics.runFullDiagnostics();
    } catch (error) {
      console.error('Diagnostic error:', error);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Razorpay Integration Setup
            </h1>
            <p className="text-gray-600 mt-1">
              Verify your Razorpay payment gateway configuration
            </p>
          </div>
          <Button
            onClick={runDiagnostics}
            loading={testing}
            variant="outline"
          >
            <RefreshCw className="w-4 h-4" />
            Re-test
          </Button>
        </div>

        {results && (
          <div className="space-y-4">
            {/* Overall Status */}
            <div
              className={`p-4 rounded-lg border ${
                results.overallReady
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {results.overallReady ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {results.overallReady
                      ? '✅ Razorpay is Ready!'
                      : '⚠️ Setup Incomplete'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {results.overallReady
                      ? 'Your payment gateway is configured and ready to process payments.'
                      : 'Some configuration steps are missing. Please complete the checklist below.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Checks */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Configuration Checklist:</h3>

              {/* Environment Variables */}
              <div
                className={`p-4 rounded-lg border ${getStatusColor(
                  results.environmentVariables
                )}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(results.environmentVariables)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      1. Environment Variables
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {results.environmentVariables
                        ? 'VITE_RAZORPAY_KEY_ID is configured in .env file'
                        : 'Missing Razorpay API key in .env file'}
                    </p>
                    {!results.environmentVariables && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium text-gray-900 mb-1">Fix:</p>
                        <code className="block bg-gray-900 text-green-400 p-2 rounded">
                          VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here
                          <br />
                          VITE_RAZORPAY_KEY_SECRET=your_secret_here
                        </code>
                        <p className="text-gray-600 mt-1">
                          Add these to your .env file and restart the dev server
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Edge Function Deployment */}
              <div
                className={`p-4 rounded-lg border ${getStatusColor(
                  results.edgeFunctionDeployed
                )}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(results.edgeFunctionDeployed)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      2. Edge Function Deployment
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {results.edgeFunctionDeployed
                        ? 'create-razorpay-order function is deployed and accessible'
                        : 'Edge Function is not deployed to Supabase'}
                    </p>
                    {!results.edgeFunctionDeployed && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium text-gray-900 mb-1">Fix:</p>
                        <code className="block bg-gray-900 text-green-400 p-2 rounded text-xs">
                          supabase functions deploy create-razorpay-order
                          <br />
                          supabase functions deploy verify-razorpay-payment
                        </code>
                        <p className="text-gray-600 mt-1">
                          Deploy functions using Supabase CLI
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Razorpay Credentials */}
              <div
                className={`p-4 rounded-lg border ${getStatusColor(
                  results.razorpayCredentials
                )}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(results.razorpayCredentials)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      3. Razorpay API Credentials
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {results.razorpayCredentials
                        ? 'Razorpay API keys are configured in Edge Function'
                        : 'Razorpay API keys missing in Supabase Edge Function secrets'}
                    </p>
                    {!results.razorpayCredentials && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium text-gray-900 mb-1">Fix:</p>
                        <code className="block bg-gray-900 text-green-400 p-2 rounded text-xs">
                          supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxx
                          <br />
                          supabase secrets set RAZORPAY_KEY_SECRET=your_secret
                        </code>
                        <p className="text-gray-600 mt-1">
                          Set secrets using Supabase CLI or Dashboard
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Documentation Links */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                📚 Setup Guides:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <strong>Quick Start:</strong> RAZORPAY_QUICK_START.md (5 min setup)
                </li>
                <li>
                  • <strong>Complete Guide:</strong> RAZORPAY_INTEGRATION_GUIDE.md
                </li>
                <li>
                  • <strong>Browser Console:</strong> Check for detailed diagnostic logs
                </li>
              </ul>
            </div>

            {/* Next Steps */}
            {!results.overallReady && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  🚀 Next Steps:
                </h4>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                  {!results.environmentVariables && (
                    <li>Update .env file with Razorpay API keys</li>
                  )}
                  {!results.edgeFunctionDeployed && (
                    <li>Deploy Edge Functions to Supabase</li>
                  )}
                  {!results.razorpayCredentials && (
                    <li>Set Razorpay secrets in Supabase Edge Functions</li>
                  )}
                  <li>Click "Re-test" button to verify setup</li>
                  <li>Test payment on checkout page</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {testing && !results && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Running diagnostics...</p>
          </div>
        )}
      </div>
    </div>
  );
}
