import React, { useEffect, useMemo, useState } from 'react';
import { apiRequest, resolveAssetUrl, updateStoredUser } from '../../auth.js';

const requiredFields = ['fullName', 'username', 'email', 'mobileNumber', 'address'];

const labels = {
  address: 'Address',
  dateOfBirth: 'Date of Birth',
  email: 'Email',
  fullName: 'Full Name',
  gender: 'Gender',
  mobileNumber: 'Mobile Number',
  role: 'Role',
  username: 'Username',
};

function formatDateInput(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

function normalizeValues(profile = {}, user = {}) {
  return {
    address: profile.address || '',
    dateOfBirth: formatDateInput(profile.dateOfBirth),
    email: profile.email || user.email || '',
    fullName: profile.fullName || user.fullName || user.username || '',
    gender: profile.gender || '',
    mobileNumber: profile.mobileNumber || user.mobileNumber || '',
    role: user.role || profile.user?.role || '',
    username: profile.user?.username || user.username || '',
  };
}

export default function EditProfile({ fallbackAvatar, onCancel, onSaved, profile, roleLabel, user }) {
  const initialValues = useMemo(() => normalizeValues(profile, user), [profile, user]);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [removeImage, setRemoveImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
    setImageFile(null);
    setRemoveImage(false);
    setPreviewUrl(profile?.profileImage ? resolveAssetUrl(profile.profileImage) : fallbackAvatar || '');
  }, [fallbackAvatar, initialValues, profile?.profileImage]);

  useEffect(() => {
    if (!imageFile) return undefined;

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const validate = () => {
    const nextErrors = {};

    requiredFields.forEach((field) => {
      if (!String(values[field] || '').trim()) {
        nextErrors[field] = `${labels[field]} is required.`;
      }
    });

    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (values.mobileNumber && !/^\d+$/.test(String(values.mobileNumber))) {
      nextErrors.mobileNumber = 'Mobile number must contain only numbers.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setRemoveImage(false);
    if (!file) {
      setPreviewUrl(profile?.profileImage ? resolveAssetUrl(profile.profileImage) : fallbackAvatar || '');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    setRemoveImage(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setSubmitError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'role') formData.append(key, value ?? '');
      });
      if (imageFile) formData.append('profileImage', imageFile);
      if (removeImage) formData.append('removeProfileImage', 'true');

      const payload = await apiRequest('/api/profile/me', {
        method: 'PUT',
        body: formData,
      });

      const updatedUser = updateStoredUser(payload.user || {});
      setMessage(payload.message || 'Profile updated successfully.');
      onSaved?.(payload.profile, updatedUser || payload.user);
    } catch (error) {
      setSubmitError(error.message || 'Unable to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="dashboard-form edit-profile-form" onSubmit={handleSubmit}>
      <div className="edit-profile-form__image">
        {previewUrl ? (
          <img src={previewUrl} alt="Profile preview" />
        ) : (
          <div className="edit-profile-form__placeholder">No Image</div>
        )}
        <label>
          <span>Profile Image</span>
          <input accept="image/*" name="profileImage" type="file" onChange={handleImageChange} />
        </label>
        <button className="btn btn--primary" type="button" onClick={handleRemoveImage}>
          Remove Image
        </button>
      </div>

      {['fullName', 'username', 'email', 'mobileNumber', 'address', 'dateOfBirth'].map((field) => (
        <label key={field}>
          <span>{labels[field]}</span>
          <input
            name={field}
            type={field === 'dateOfBirth' ? 'date' : field === 'email' ? 'email' : 'text'}
            value={values[field] || ''}
            onChange={handleChange}
          />
          {errors[field] && <small className="field-error">{errors[field]}</small>}
        </label>
      ))}

      <label>
        <span>Gender</span>
        <select name="gender" value={values.gender || ''} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </label>

      <label>
        <span>Role</span>
        <input readOnly name="role" type="text" value={roleLabel || values.role || 'Not available'} />
      </label>

      <div className="edit-profile-form__actions">
        <button className="btn btn--primary" disabled={submitting} type="submit">
          {submitting ? 'Saving...' : 'Save'}
        </button>
        <button className="btn btn--primary" disabled={submitting} type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>

      {(message || submitError) && (
        <div className="profile-field edit-profile-form__feedback">
          <span>Status</span>
          <strong>{submitError || message}</strong>
        </div>
      )}
    </form>
  );
}
