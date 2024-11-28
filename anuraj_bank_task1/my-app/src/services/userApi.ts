import axios from 'axios';

const API_URL = 'http://localhost:5000/users'; 
const token = sessionStorage.getItem('authToken');

// Fetch all users
export const fetchUsers = async () => {
  const response = await axios.get(API_URL,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Add a new user
export const addUserAPI = async (user: { firstName: string; middleName: string; lastName: string; username: string; password: string }) => {
  const response = await axios.post(API_URL, user,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update an existing user
export const updateUserAPI = async (id: string, user: { firstName: string; middleName: string; lastName: string; username: string; password: string }) => {
  const response = await axios.put(`${API_URL}/${id}`, user,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete a user
export const deleteUserAPI = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
