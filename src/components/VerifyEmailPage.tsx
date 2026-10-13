import { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    if (!email) {
      setStatus('error');
      setMessage('No email provided. Please sign up again.');
      return;
    }

    // In a real app, you'd get the token from the URL params
    // For now, we'll show a message that the user should check their email
    setStatus('success');
    setMessage(`A verification email has been sent to ${email}. Please check your inbox and click the link to verify your account.`);
  };

  const resendEmail = async () => {
    // TODO: Implement resend verification email
    alert('Resend functionality not yet implemented');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 mb-4">
              <Mail size={32} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
            <p className="text-gray-500 mt-2">We've sent a verification link to your email</p>
          </div>

          <div className="space-y-6">
            {status === 'loading' && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-gray-600">Verifying your email...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Check Your Inbox</h3>
                  <p className="text-gray-600 mt-2">{message}</p>
                </div>
                <button
                  onClick={resendEmail}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Resend Verification Email
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <AlertCircle className="w-16 h-16 text-red-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Verification Failed</h3>
                  <p className="text-gray-600 mt-2">{message}</p>
                </div>
                <button
                  onClick={() => window.location.href = '/auth/sign-up'}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Sign Up
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3 text-blue-800">
              <ChevronRight className="w-4 h-4 inline mr-1" />
              <span>Didn't receive the email? Check your spam folder or request a new one.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}