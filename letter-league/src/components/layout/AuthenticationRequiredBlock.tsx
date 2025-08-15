import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '@/features/auth/AuthContext';

export default function AuthenticationRequiredBlock() {
  const { setShowLoginModal } = useAuth();

  return (
    <div className="flex flex-col gap-6 items-center justify-center text-center max-w-md mx-auto p-8">
      {/* Icon */}
      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
        <Lock className="w-8 h-8 text-primary" />
      </div>
      
      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">
          Authentication Required
        </h2>
        <p className="text-foreground-muted leading-relaxed">
          You must login or create a guest session to access this page.
        </p>
      </div>
      
      {/* Button */}
      <Button onClick={() => setShowLoginModal(true)} size="lg">
        Continue
        <ArrowRight className="w-4 h-4" />
      </Button>
  </div>
  );
}