import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUsers, addUser, updateUser, deleteUser } from '../redux/userSlice';
import { RootState, AppDispatch } from '../redux/store';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, Box, Paper,Grid
} from '@mui/material';
import { validateForm } from '../utils/helper';

// Importing constants for labels
import * as Labels from '../utils/constants';

// Type for the form state
interface UserForm {
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword ?: string;
}

const UserTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  const [form, setForm] = useState<UserForm>({
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Add or Update user
  const handleAddUser = () => {
    setIsSubmitting(true);
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    if (editIndex === null) {
      dispatch(addUser(form));
    } else {
      dispatch(updateUser({ id: users[editIndex].id, user: form }));
    }
    resetForm();
  };

  // Reset form and errors
  const resetForm = () => {
    setForm({
      firstName: '',
      middleName: '',
      lastName: '',
      username: '',
      password: '',
      confirmPassword: '',
    });
    setEditIndex(null);
    setErrors({});
  };

  // Handle Edit user
  const handleEditUser = (index: number) => {
    const user = users[index];
    setForm(user);
    setEditIndex(index);
    setErrors({});
  };

  // Handle Delete user
  const handleDeleteUser = (id: string) => {
    dispatch(deleteUser(id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box>
      <Box sx={{ marginBottom: 2 }}>
        <Grid lg={6} sx={{ marginBottom: 2 }}>
            <TextField
            label={Labels.FIRST_NAME} 
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            />
            <TextField
            label={Labels.MIDDLE_NAME}  
            name="middleName"
            value={form.middleName}
            onChange={handleChange}
            />
            <TextField
            label={Labels.LAST_NAME}  
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            />

        </Grid>
        <Grid lg={6}>
            <TextField
            label={Labels.USERNAME}  
            name="username"
            value={form.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            />
            <TextField
            label={Labels.PASSWORD}  
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            />
            <TextField
            label={Labels.CONFIRM_PASSWORD}  
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            />
        </Grid>        
      </Box>
      <Box sx={{paddingBottom:2,justifyContent:'right'}}>
      <Button
          variant="contained"
          color="primary"
          onClick={handleAddUser}
          sx={{ marginLeft: 2 }}
          disabled={isSubmitting}
        >
          {editIndex === null ? Labels.ADD_USER : Labels.UPDATE_USER}  {/* Using constants for button text */}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={resetForm}
          sx={{ marginLeft: 2 }}
        >
          {Labels.CLEAR}  {/* Using the constant for Clear button text */}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{Labels.FIRST_NAME}</TableCell>  {/* Using constants in Table Headers */}
              <TableCell>{Labels.MIDDLE_NAME}</TableCell>
              <TableCell>{Labels.LAST_NAME}</TableCell>
              <TableCell>{Labels.USERNAME}</TableCell>
              <TableCell>{Labels.PASSWORD}</TableCell>
              <TableCell>{Labels.ACTIONS}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.middleName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditUser(index)}
                  >
                    {Labels.EDIT}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteUser(user.id)}
                    sx={{ marginLeft: 1 }}
                  >
                    {Labels.DELETE}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserTable;
