import React, { useState } from 'react';
import ForgotPassword from './ForgotPassword';
import EmailOTPVerification from './EmailOtpVerification';
import NewPassword from './CreatePassword';


const PasswordReset = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const handleEmailVerified = (verifiedEmail) => {
    setEmail(verifiedEmail);
    setStep(2);
  };

  const handleOTPVerified = (verificationToken) => {
    console.log("token ", token)
    setToken(verificationToken);
    setStep(3);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Password Recovery</h1>
        
        {step === 1 && <ForgotPassword onEmailVerified={handleEmailVerified} />}
        {step === 2 && <EmailOTPVerification email={email} onOTPVerified={handleOTPVerified} />}
        {step === 3 && <NewPassword email={email} token={token} />}
      </div>
    </div>
  );
};

export default PasswordReset;