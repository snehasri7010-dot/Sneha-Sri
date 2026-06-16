import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthField from '../components/Auth/AuthField.jsx';
import AuthLayout from '../components/Auth/AuthLayout.jsx';
import { getDashboardPath, loginRequest, setAuthData } from '../auth.js';

const initialValues = {
  username: '',
  password: '',
};

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!values.username.trim()) {
      nextErrors.username = 'Username is required.';
    }

    if (!values.password.trim()) {
      nextErrors.password = 'Password is required.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    const formValues = {
      username: values.username,
      password: values.password,
    };

    console.log('Login form values:', formValues);

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    try {
      const requestBody = {
        emailOrUsername: values.username.trim(),
        password: values.password,
      };

      console.log('Login request body:', requestBody);

      const authPayload = await loginRequest(requestBody);

      setAuthData(authPayload, true);
      navigate(getDashboardPath(authPayload.user.role));
    } catch (error) {
      setErrors({
        username: error?.message || 'Login failed. Please check your credentials.',
      });
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Login to DriveHub"
      subtitle="Access your workspace with your username and password."
      footerText="Don't have an account?"
      footerLinkText="Register"
      footerLinkTo="/register"
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthField
          error={errors.username}
          id="login-username"
          label="Username"
          name="username"
          onChange={handleChange}
          placeholder="Enter username"
          value={values.username}
        />
        <AuthField
          error={errors.password}
          id="login-password"
          label="Password"
          name="password"
          onChange={handleChange}
          placeholder="Enter password"
          type="password"
          value={values.password}
        />
        <button className="btn btn--primary" type="submit">
          Login
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
