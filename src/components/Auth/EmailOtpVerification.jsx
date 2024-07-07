import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../utils';

const EmailOTPVerification = ({ email, onOTPVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const otpString = otp.join('');

    try {
      const response = await axios.post(`${BASE_URL}/admin/verify_email_otp`, { email, otp: otpString });
      if (response.status === 200) {
        toast.success('OTP verified successfully');
        onOTPVerified(response.data.token);
      } else {
        toast.error('Invalid OTP');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-900">Verify OTP</h2>
      
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      <div className="flex justify-center space-x-2">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={data}
            onChange={(e) => handleOtpChange(e.target, index)}
            onFocus={(e) => e.target.select()}
            className="w-12 h-12 text-center text-xl font-bold text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </button>
      </div>
    </form>
  );
};

export default EmailOTPVerification;