import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthField from '../components/Auth/AuthField.jsx';
import AuthLayout from '../components/Auth/AuthLayout.jsx';
import { getDashboardPath, registerRequest, setAuthData } from '../auth.js';

const roles = ['owner', 'renter', 'admin'];

const initialValues = {
  fullName: '',
  email: '',
  mobileNumber: '',
  username: '',
  password: '',
  confirmPassword: '',
  role: '',
};

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSuccess('');
  };

  const validate = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^[0-9]{10}$/;

    if (!values.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!emailPattern.test(values.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!values.mobileNumber.trim()) {
      nextErrors.mobileNumber = 'Mobile number is required.';
    } else if (!mobilePattern.test(values.mobileNumber)) {
      nextErrors.mobileNumber = 'Enter a 10 digit mobile number.';
    }

    if (!values.username.trim()) {
      nextErrors.username = 'Username is required.';
    }

    if (!values.password.trim()) {
      nextErrors.password = 'Password is required.';
    }

    if (!values.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Confirm password is required.';
    } else if (values.password !== values.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!values.role) {
      nextErrors.role = 'Select a role.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    try {
      const authPayload = await registerRequest({
        fullName: values.fullName,
        email: values.email,
        mobileNumber: values.mobileNumber,
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role,
      });

      setAuthData(authPayload, true);
      setSuccess('Registration successful. Redirecting to dashboard...');
      window.setTimeout(() => navigate(getDashboardPath(authPayload.user.role)), 700);
    } catch (error) {
      setErrors({
        username: error?.message || 'Registration failed. Please try again.',
      });
    }
  };

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Register for DriveHub"
      subtitle="Set up a profile for renting, listing, or managing cars."
      footerText="Already have an account?"
      footerLinkText="Login"
      footerLinkTo="/login"
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__grid">
          <AuthField
            error={errors.fullName}
            id="register-full-name"
            label="Full Name"
            name="fullName"
            onChange={handleChange}
            placeholder="Enter full name"
            value={values.fullName}
          />
          <AuthField
            error={errors.email}
            id="register-email"
            label="Email Address"
            name="email"
            onChange={handleChange}
            placeholder="Enter email"
            type="email"
            value={values.email}
          />
          <AuthField
            error={errors.mobileNumber}
            id="register-mobile"
            label="Mobile Number"
            name="mobileNumber"
            onChange={handleChange}
            placeholder="10 digit mobile number"
            type="tel"
            value={values.mobileNumber}
          />
          <AuthField
            error={errors.username}
            id="register-username"
            label="Username"
            name="username"
            onChange={handleChange}
            placeholder="Choose username"
            value={values.username}
          />
          <AuthField
            error={errors.password}
            id="register-password"
            label="Password"
            name="password"
            onChange={handleChange}
            placeholder="Create password"
            type="password"
            value={values.password}
          />
          <AuthField
            error={errors.confirmPassword}
            id="register-confirm-password"
            label="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            placeholder="Confirm password"
            type="password"
            value={values.confirmPassword}
          />
          <AuthField
            error={errors.role}
            id="register-role"
            label="Role Selection"
            name="role"
            onChange={handleChange}
            options={roles.map((r) => r.charAt(0).toUpperCase() + r.slice(1))}
            value={values.role}
          />
        </div>
        {success && <p className="auth-form__success">{success}</p>}
        <button className="btn btn--primary" type="submit">
          Register
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;
