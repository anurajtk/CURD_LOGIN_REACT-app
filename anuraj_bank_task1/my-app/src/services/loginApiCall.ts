import axios from 'axios';

// Define the response structure
interface LoginResponse {
  status: string;
  authToken: string;
  message: string;
}

// API function to handle login
export const loginApiCall = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post('http://localhost:5000/login', {
      email,
      password
    });
    console.log(response)
    // Return the response data with token
    return response.data
  } catch (err:any) {
  
    // In case of error, throw a descriptive message
   //throw new Error('Invalid credentials or server error');
   return err
  }
};

