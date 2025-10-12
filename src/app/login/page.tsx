'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plane, User } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Banner */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-6xl font-bold text-yellow-400 drop-shadow-lg">
          Road Trip!!
        </div>
        
        <div className="absolute top-20 right-20">
          <div className="bg-amber-600 text-white px-4 py-2 rounded-lg text-lg font-semibold transform rotate-12 shadow-lg">
            Let&apos;s
          </div>
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-lg font-semibold transform -rotate-6 mt-2 shadow-lg">
            Travel
          </div>
        </div>

        {/* Airplane path */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
          <Plane className="w-8 h-8 text-blue-600 animate-pulse" />
          <div className="w-32 h-0.5 bg-blue-300 border-dashed border-t-2 border-blue-400 mt-2"></div>
        </div>

        {/* Character illustration */}
        <div className="absolute bottom-20 left-20">
          <div className="bg-green-200 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-green-700" />
          </div>
          <div className="bg-yellow-300 w-12 h-8 rounded-lg mt-2 shadow-lg"></div>
        </div>

        {/* Camper van illustration */}
        <div className="absolute bottom-20 right-20">
          <div className="bg-green-400 w-20 h-12 rounded-lg shadow-lg relative">
            <div className="absolute -top-2 left-2 w-4 h-4 bg-red-500 rounded"></div>
            <div className="absolute -top-1 right-2 w-3 h-3 bg-yellow-400 rounded"></div>
            <div className="absolute -top-1 right-6 w-3 h-3 bg-yellow-400 rounded"></div>
            <div className="absolute -top-1 right-10 w-3 h-3 bg-green-600 rounded"></div>
          </div>
        </div>

        {/* Company branding */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <Plane className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-4xl font-bold text-blue-800">Linguini Holidays</h1>
            </div>
            <p className="text-lg text-gray-600 mb-2">Tours & Travel Company</p>
            <p className="text-sm text-gray-500">since 2024</p>
            <div className="mt-4 text-sm text-gray-600">
              <p>www.linguiniholidays.com</p>
              <p className="font-semibold">LINGUINI HOLIDAYS PRIVATE LIMITED</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your Linguini Holidays CRM account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
