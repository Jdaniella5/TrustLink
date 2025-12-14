import {apiCall} from './apiCall';

//Register
export const registerUser =(data) =>{
   return( apiCall ('api/user/register', 'POST' ,data));
};
//Login
export const loginUser =(data) =>{
   return( apiCall ('api/user/login', 'POST' ,data));
};
//Email OTP Verification
export const verifyOtp =(data) =>{
   return( apiCall ('api/user/verify-otp', 'POST' ,data));
};
//Email Resend OTP
export const resendOtp =(data) =>{
   return( apiCall ('api/user/resend-otp', 'POST' ,data));
};
//Email Send OTP 
export const sendOtp =(data) =>{
   return( apiCall ('api/user/send-otp', 'POST' ,data));
}
//Check Authentication
export const checkAuth = () => {
  return apiCall('api/user/check', 'GET');
};
//Logout
export const logoutUser = () => {
   return( apiCall ('api/user/logout', 'POST' ));
}