
import React from 'react';

interface OnboardingStepProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({ 
  children, 
  step, 
  totalSteps, 
  title, 
  subtitle 
}) => {
  const progressPercent = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Progress Bar */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Content */}
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-400 text-lg">
              {subtitle}
            </p>
          )}
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default OnboardingStep;
