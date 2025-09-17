# LMS Test Credentials

This document contains the default test credentials for the Learning Management System (LMS).

## Default Test Users

### Admin User
- **Email:** `admin@lms.com`
- **Password:** `password`
- **Role:** Admin
- **Access:** Full system access

### Instructor User
- **Email:** `instructor@lms.com`
- **Password:** `password`
- **Role:** Instructor
- **Access:** Course creation and management

### Student User
- **Email:** `student@lms.com`
- **Password:** `password`
- **Role:** Student
- **Access:** Course enrollment and learning

### Deepanshu (Student)
- **Email:** `deepanshu@gmail.com`
- **Password:** `password`
- **Role:** Student
- **Access:** Course enrollment and learning

## How to Use

1. Navigate to the login page
2. Enter any of the above email addresses
3. Use `password` as the password for all test accounts
4. Click "Sign In"

## Error Handling

The system will display appropriate error messages for:
- Invalid email format
- Password less than 6 characters
- Wrong email or password combination
- Network/server errors

## Development Notes

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Tokens expire after 24 hours by default
- The auth service runs on port 3001
- API Gateway runs on port 3000

## Security Warning

⚠️ **These are test credentials only!** Do not use these credentials in production. Make sure to:
- Change all default passwords
- Use strong, unique passwords
- Implement proper user registration
- Use environment variables for sensitive data
