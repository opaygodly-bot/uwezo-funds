import React, { useState } from 'react';
import Logo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Phone, CreditCard, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginScreenProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetPhone, setResetPhone] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const { login, resetPassword } = useAuth();

  const validatePhoneNumber = (phone: string) => {
    const kenyanPhoneRegex = /^(07\d{8}|01\d{8})$/;
    return kenyanPhoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validatePhoneNumber(phone)) {
      setError('Please enter a valid Kenyan phone number (07XXXXXXXX)');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(phone, password);
      onLoginSuccess();
    } catch (err) {
      const msg = (err as Error).message || '';
      if (msg === 'Phone number not registered') {
        setError('Phone number not registered');
      } else if (msg === 'Wrong password') {
        setError('Wrong password');
      } else {
        setError('Sign in failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setResetMessage('');
    setError('');
    if (!resetPhone) {
      setResetMessage('Please enter your phone number');
      return;
    }
    if (!resetNewPassword || resetNewPassword.length < 6) {
      setResetMessage('Please enter a new password (min 6 characters)');
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setResetMessage('Passwords do not match');
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(resetPhone, resetNewPassword);
      setResetMessage('Password updated. You can now sign in with your new password.');
      setShowReset(false);
    } catch (err) {
      setResetMessage((err as Error).message || 'Reset failed');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="text-center space-y-2">
          <img src={Logo} alt="Uwezo Funds logo" className="w-16 h-16 rounded-full object-cover mx-auto" />
          <CardTitle className="text-2xl font-bold text-foreground">Welcome to Uwezo Funds</CardTitle>
          <p className="text-muted-foreground">Your trusted loan partner in Kenya</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="07XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                className="text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-base"
              />
            </div>
            
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:bg-primary-dark"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="text-center mt-2">
            <button
              onClick={() => { setShowReset(!showReset); setResetMessage(''); }}
              className="text-sm text-muted-foreground underline"
            >
              Forgot password?
            </button>
          </div>

          {showReset && (
            <form onSubmit={handleReset} className="mt-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="resetPhone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Registered Phone Number
                </Label>
                <Input
                  id="resetPhone"
                  type="tel"
                  placeholder="07XXXXXXXX"
                  value={resetPhone}
                  onChange={(e) => setResetPhone(e.target.value)}
                  maxLength={10}
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resetNewPassword" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  New Password
                </Label>
                <Input
                  id="resetNewPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resetConfirmPassword" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Confirm New Password
                </Label>
                <Input
                  id="resetConfirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  className="text-base"
                />
              </div>

              {resetMessage && (
                <div className="text-sm text-muted-foreground">{resetMessage}</div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:bg-primary-dark"
                disabled={resetLoading}
              >
                {resetLoading ? 'Updating...' : 'Set New Password'}
              </Button>
            </form>
          )}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              New to Uwezo Funds?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-primary font-medium hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};