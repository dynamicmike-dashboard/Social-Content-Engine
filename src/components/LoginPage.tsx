import { SignIn } from '@clerk/react';
import { Building2, CheckCircle } from 'lucide-react';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 mb-4">
              <Building2 size={32} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to your Social Content Engine account</p>
          </div>

          <div className="space-y-6">
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: 'w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  card: 'shadow-none border-none p-0',
                  headerTitle: 'text-2xl font-bold text-gray-900',
                  headerSubtitle: 'text-gray-500 mt-2',
                },
              }}
              routing="path"
              path="/sign-in"
              signUpUrl="/auth/sign-up"
            />
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3 text-blue-800">
              <CheckCircle size={24} />
              <div>
                <p className="font-semibold">Authorized Access Only</p>
                <p className="text-sm">This portal is for verified clients only. Contact your account manager for access.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}