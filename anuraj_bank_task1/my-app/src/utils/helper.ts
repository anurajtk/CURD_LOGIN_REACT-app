
/**
 * Validates the username (email).
 * Username must be at least 3 characters long and contain no spaces.
 */
export const validateUsername = (username: string): string | null => {
    if (!username) {
      return 'Username is required.';
    }
    if (username.length < 3) {
      return 'Username should be at least 3 characters long.';
    }
    if (username.includes(' ')) {
      return 'Username should not contain spaces.';
    }
    return null;
  };
  
  /**
   * Validates the password.
   * Password must be between 8-12 characters long and contain no spaces.
   */
  export const validatePassword = (password: string): string | null => {
    if (!password) {
      return 'Password is required.';
    }
    if (password.length < 8 || password.length > 12) {
      return 'Password should be between 8 and 12 characters.';
    }
    if (password.includes(' ')) {
      return 'Password should not contain spaces.';
    }
    return null;
  };

// Validate dashboard form
export const validateForm = (form: any) => {
  const errors: any = {};

  // Check required fields
  if (!form.firstName) errors.firstName = 'First Name is required';
  if (!form.lastName) errors.lastName = 'Last Name is required';
  if (!form.username) errors.username = 'Username is required';
  if (!form.password) errors.password = 'Password is required';
  if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords must match';

  // Password length validation
  if (form.password && (form.password.length < 8 || form.password.length > 12)) {
    errors.password = 'Password must be between 8 and 12 characters';
  }

  // Username length validation
  if (form.username && form.username.length > 20) {
    errors.username = 'Username must be 20 characters or less';
  }

  return errors;
};

  