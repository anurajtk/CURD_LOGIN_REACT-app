import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchUsers, addUserAPI, updateUserAPI, deleteUserAPI } from '../services/userApi';

// Define the types for a User
interface User {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  password: string;
}

// Define the initial state type
interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// Async thunks to handle API calls
export const loadUsers = createAsyncThunk('users/loadUsers', async () => {
  const users = await fetchUsers();
  return users;
});

export const addUser = createAsyncThunk('users/addUser', async (user: Omit<User, 'id'>) => {
  const newUser = await addUserAPI(user);
  return newUser;
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, user }: { id: string; user: Omit<User, 'id'> }) => {
  const updatedUser = await updateUserAPI(id, user);
  return updatedUser;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: string) => {
  await deleteUserAPI(id);
  return id;
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load users
      .addCase(loadUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch users';
        state.loading = false;
      })

      // Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
        state.loading = false;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add user';
        state.loading = false;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index >= 0) {
          state.users[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update user';
        state.loading = false;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter(user => user.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete user';
        state.loading = false;
      });
  },
});

// Export the reducer to be used in the store
export default userSlice.reducer;
