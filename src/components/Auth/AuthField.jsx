import React from 'react';

function AuthField({
  error,
  id,
  label,
  name,
  onChange,
  options,
  placeholder,
  type = 'text',
  value,
}) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <label className={`auth-field ${error ? 'auth-field--error' : ''}`} htmlFor={id}>
      <span>{label}</span>
      {options ? (
        <select
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          id={id}
          name={name}
          onChange={onChange}
          value={value}
        >
          <option value="">Select role</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          id={id}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      )}
      {error && (
        <small id={describedBy} role="alert">
          {error}
        </small>
      )}
    </label>
  );
}

export default AuthField;
