import { supabase } from '../lib/supabase';

/**
 * Razorpay Integration Diagnostics
 * Run this to check if your Razorpay setup is correct
 */
export const razorpayDiagnostics = {
  /**
   * Check if environment variables are configured
   */
  checkEnvironmentVariables(): { valid: boolean; message: string } {
    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    if (!razorpayKeyId) {
      return {
        valid: false,
        message: '❌ VITE_RAZORPAY_KEY_ID is not set in .env file'
      };
    }
    
    if (!razorpayKeyId.startsWith('rzp_')) {
      return {
        valid: false,
        message: '⚠️ VITE_RAZORPAY_KEY_ID format seems incorrect (should start with rzp_)'
      };
    }
    
    return {
      valid: true,
      message: '✅ Environment variables configured correctly'
    };
  },

  /**
   * Test Edge Function connectivity
   */
  async testEdgeFunctionConnectivity(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      // Try to invoke the function with test data
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: 100, // Test amount: ₹1.00
          currency: 'INR',
          receipt: 'diagnostic_test_' + Date.now(),
        },
      });

      if (error) {
        // Check error type
        if (error.message?.includes('not found') || error.message?.includes('404')) {
          return {
            success: false,
            message: '❌ Edge Function "create-razorpay-order" not deployed',
            details: 'Please deploy the function using Supabase CLI or Dashboard'
          };
        }
        
        if (error.message?.includes('Missing required fields')) {
          return {
            success: false,
            message: '❌ Razorpay API credentials missing in Edge Function',
            details: 'Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Supabase secrets'
          };
        }

        if (data && data.error) {
          return {
            success: false,
            message: '❌ Razorpay API error: ' + data.error,
            details: data.details || data
          };
        }

        return {
          success: false,
          message: '❌ Edge Function error',
          details: error.message
        };
      }

      return {
        success: true,
        message: '✅ Edge Function is working correctly',
        details: data
      };
    } catch (error: any) {
      return {
        success: false,
        message: '❌ Connection error: ' + error.message,
        details: error
      };
    }
  },

  /**
   * Run all diagnostic checks
   */
  async runFullDiagnostics(): Promise<void> {
    console.log('🔍 Running Razorpay Integration Diagnostics...\n');

    // Check 1: Environment Variables
    console.log('1️⃣ Checking Environment Variables...');
    const envCheck = this.checkEnvironmentVariables();
    console.log(envCheck.message);
    console.log('');

    if (!envCheck.valid) {
      console.log('⛔ Cannot proceed with further checks. Please fix environment variables first.');
      console.log('See .env.example or RAZORPAY_INTEGRATION_GUIDE.md for help.\n');
      return;
    }

    // Check 2: Edge Function
    console.log('2️⃣ Testing Edge Function Connectivity...');
    const funcCheck = await this.testEdgeFunctionConnectivity();
    console.log(funcCheck.message);
    if (funcCheck.details) {
      console.log('Details:', funcCheck.details);
    }
    console.log('');

    // Summary
    if (envCheck.valid && funcCheck.success) {
      console.log('🎉 All checks passed! Razorpay integration is ready.');
      console.log('You can now process payments through checkout.');
    } else {
      console.log('⚠️ Some checks failed. Please fix the issues above.');
      console.log('\n📚 Troubleshooting Resources:');
      console.log('- RAZORPAY_INTEGRATION_GUIDE.md');
      console.log('- RAZORPAY_QUICK_START.md');
      console.log('- Check Supabase Dashboard > Edge Functions');
      console.log('- Check Supabase Dashboard > Settings > Edge Functions > Secrets');
    }
    console.log('');
  },

  /**
   * Get setup status
   */
  async getSetupStatus(): Promise<{
    environmentVariables: boolean;
    edgeFunctionDeployed: boolean;
    razorpayCredentials: boolean;
    overallReady: boolean;
  }> {
    const envCheck = this.checkEnvironmentVariables();
    const funcCheck = await this.testEdgeFunctionConnectivity();

    const status = {
      environmentVariables: envCheck.valid,
      edgeFunctionDeployed: !funcCheck.message.includes('not deployed'),
      razorpayCredentials: !funcCheck.message.includes('credentials missing'),
      overallReady: envCheck.valid && funcCheck.success,
    };

    return status;
  }
};

// Export a convenience function to run diagnostics
export const runRazorpayDiagnostics = () => razorpayDiagnostics.runFullDiagnostics();
