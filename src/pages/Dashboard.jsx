import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import carLogo from '../assets/images/car-logo3.png';
import { apiRequest, clearAuthData, getCurrentUser, getDashboardPath, resolveAssetUrl } from '../auth.js';
import EditProfile from '../components/EditProfile/EditProfile.jsx';
import './Dashboard.css';

const carImages = {
  city: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80',
  suv: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80',
  luxury: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
};

const peopleImages = {
  admin: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  owner: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  renter: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80',
  user: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
};

const dashboardLinks = [
  { title: 'Admin Dashboard', to: '/admin-dashboard', text: 'Users, cars, bookings, and admin profile.' },
  { title: 'Car Owner Dashboard', to: '/owner-dashboard', text: 'Owner profile, listed cars, add car, and booking approvals.' },
  { title: 'Renter Dashboard', to: '/renter-dashboard', text: 'Renter profile, car search, bookings, and cancellation.' },
];

const adminNavItems = [
  { label: 'Overview', to: 'overview' },
  { label: 'User Management', to: 'users' },
  { label: 'Car Management', to: 'cars' },
  { label: 'Booking Management', to: 'bookings' },
  { label: 'Admin Profile', to: 'profile' },
];

const ownerNavItems = [
  { label: 'Owner Profile', to: 'profile' },
  { label: 'My Cars', to: 'cars' },
  { label: 'Add Car Form', to: 'add-car' },
  { label: 'Booking Requests', to: 'booking-requests' },
];

const renterNavItems = [
  { label: 'Renter Profile', to: 'profile' },
  { label: 'Search Cars', to: 'search-cars' },
  { label: 'Browse Cars', to: 'browse-cars' },
  { label: 'Book Car', to: 'book-car' },
  { label: 'Booking History', to: 'booking-history' },
  { label: 'Cancel Booking', to: 'cancel-booking' },
];

const emptyProfile = {
  fullName: '',
  email: '',
  mobileNumber: '',
  address: '',
  dateOfBirth: '',
  gender: '',
  profileImage: '',
};

function Dashboard() {
  return (
    <main className="dashboard-home">
      <section className="dashboard-home__panel reveal-up">
        <img src={carLogo} alt="" aria-hidden="true" />
        <span className="eyebrow">DriveHub Workspace</span>
        <h1>Choose Your Dashboard</h1>
        <p>Open any frontend-only dashboard below. Each page now connects to backend data.</p>
        <div className="dashboard-home__links">
          {dashboardLinks.map((link) => (
            <Link className="dashboard-home__link" key={link.to} to={link.to}>
              <strong>{link.title}</strong>
              <span>{link.text}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function AdminDashboard() {
  return (
    <DashboardShell
      role="Admin"
      title="Admin Dashboard"
      subtitle="Monitor users, cars, bookings, and platform access settings."
      navItems={adminNavItems}
      profileImage={peopleImages.admin}
    />
  );
}

function OwnerDashboard() {
  return (
    <DashboardShell
      role="Car Owner"
      title="Car Owner Dashboard"
      subtitle="Manage your profile, listed cars, car submissions, and booking approvals."
      navItems={ownerNavItems}
      profileImage={peopleImages.owner}
    />
  );
}

function RenterDashboard() {
  return (
    <DashboardShell
      role="Renter"
      title="Renter Dashboard"
      subtitle="Search available cars, book trips, review history, and cancel requests."
      navItems={renterNavItems}
      profileImage={peopleImages.renter}
    />
  );
}

function DashboardShell({ children, navItems, profileImage, role, subtitle, title }) {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(profileImage);

  useEffect(() => {
    let isMounted = true;

    const loadAvatar = () => {
      apiRequest('/api/profile/me')
        .then((payload) => {
          if (!isMounted) return;
          setAvatar(payload.profile?.profileImage ? resolveAssetUrl(payload.profile.profileImage) : profileImage);
        })
        .catch(() => {});
    };

    loadAvatar();
    window.addEventListener('drivehub:profile-updated', loadAvatar);

    return () => {
      isMounted = false;
      window.removeEventListener('drivehub:profile-updated', loadAvatar);
    };
  }, [profileImage]);

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <main className="role-dashboard">
      <aside className="role-sidebar">
        <Link className="role-sidebar__brand" to={getDashboardPath(role)}>
          <img src={carLogo} alt="" aria-hidden="true" />
          <span>DriveHub</span>
        </Link>
        <nav className="role-sidebar__nav" aria-label={`${role} navigation`}>
          {navItems.map((item) => (
            <NavLink end key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="role-dashboard__workspace">
        <header className="role-navbar">
          <div>
            <span className="eyebrow">{role}</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="role-navbar__actions">
            <button type="button" onClick={handleLogout} className="btn btn--primary">
              Logout
            </button>
            <img src={avatar} alt={`${role} profile`} />
          </div>
        </header>
        <div className="role-dashboard__content">{children || <Outlet />}</div>
      </section>
    </main>
  );
}

function AdminOverviewPage() {
  const { data, loading, error } = useApiData('/api/admin/dashboard');
  const dashboard = data?.dashboard || {};
  const users = Number(dashboard.users || 0);

  return (
    <>
      <Feedback loading={loading} error={error} />
      <StatsGrid
        cards={[
          ['Total Users', users],
          ['Total Car Owners', dashboard.owners ?? '0'],
          ['Total Renters', dashboard.renters ?? '0'],
          ['Total Cars', dashboard.cars ?? '0'],
          ['Total Bookings', dashboard.bookings ?? '0'],
        ]}
      />
    </>
  );
}

function AdminUsersPage() {
  const { data, loading, error } = useApiData('/api/admin/users');
  const users = data?.users || [];

  return (
    <DataSection title="User Management">
      <Feedback loading={loading} error={error} empty={!loading && !users.length} />
      <DataTable
        columns={['Profile Image', 'Full Name', 'Email', 'Mobile Number', 'Role', 'Address']}
        rows={users.map((user) => [
          <Avatar
            key={user._id}
            src={user.profileImage ? resolveAssetUrl(user.profileImage) : peopleImages[user.role] || peopleImages.user}
            label={user.fullName || user.username}
          />,
          user.fullName || user.username,
          user.email,
          user.mobileNumber,
          <Status key={`${user._id}-role`} value={titleCase(user.role)} />,
          user.address || (user.isActive ? 'Active user' : 'Inactive user'),
        ])}
      />
    </DataSection>
  );
}

function AdminCarsPage() {
  const { cars, loading, error } = useCars();

  return (
    <DataSection title="Car Management">
      <Feedback loading={loading} error={error} empty={!loading && !cars.length} />
      <CarTable cars={cars} includeId={false} />
    </DataSection>
  );
}

function AdminBookingsPage() {
  const { bookings, loading, error } = useBookings();

  return (
    <DataSection title="Booking Management">
      <Feedback loading={loading} error={error} empty={!loading && !bookings.length} />
      <DataTable
        columns={['Booking ID', 'Car ID', 'Renter ID', 'Pickup Date', 'Return Date', 'Booking Status', 'Created At']}
        rows={bookings.map((booking) => [
          shortId(booking._id),
          shortId(getObjectId(booking.car)),
          booking.renter?.username || shortId(getObjectId(booking.renter)),
          formatDate(booking.pickupDate),
          formatDate(booking.returnDate),
          <Status key={booking._id} value={titleCase(booking.bookingStatus)} />,
          formatDateTime(booking.createdAt),
        ])}
      />
    </DataSection>
  );
}

function AdminProfilePage() {
  return <UserProfileSection title="Admin Profile" fallbackAvatar={peopleImages.admin} />;
}

function OwnerProfilePage() {
  return <UserProfileSection title="Owner Profile" fallbackAvatar={peopleImages.owner} ownerFields />;
}

function OwnerCarsPage() {
  const { cars, loading, error, refresh } = useCars('/api/cars/my-cars');

  return (
    <DataSection title="My Cars">
      <Feedback loading={loading} error={error} empty={!loading && !cars.length} />
      <CarCards cars={cars} onDeleted={refresh} allowDelete />
    </DataSection>
  );
}

function OwnerAddCarPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setMessage('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('carName', values.carName || '');
      formData.append('brand', values.brand || '');
      formData.append('model', values.model || '');
      formData.append('vehicleNumber', values.vehicleNumber || '');
      formData.append('fuelType', normalizeFuel(values.fuelType));
      formData.append('seatingCapacity', values.seatingCapacity || '');
      formData.append('rentPerDay', values.rentPerDay || '');
      formData.append('availabilityStatus', values.availabilityStatus === 'Booked' ? 'false' : 'true');
      formData.append('description', values.description || '');

      if (values.carImage) {
        formData.append('carImage', values.carImage);
      }

      await apiRequest('/api/cars', {
        method: 'POST',
        body: formData,
      });
      setMessage('Car added successfully.');
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <DataSection title="Add Car Form">
      <Feedback message={message} error={error} />
      <CarForm onSubmit={handleSubmit} />
    </DataSection>
  );
}

function OwnerBookingRequestsPage() {
  const { data, loading, error, refresh } = useApiData('/api/owners/approvals');
  const approvals = data?.approvals || [];
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const updateStatus = async (approval, bookingStatus) => {
    setMessage('');
    setActionError('');
    try {
      await apiRequest(`/api/bookings/${getObjectId(approval.booking)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          bookingStatus,
          comments: bookingStatus === 'approved' ? 'Approved by owner.' : 'Rejected by owner.',
        }),
      });
      setMessage(`Booking ${bookingStatus}.`);
      refresh();
    } catch (statusError) {
      setActionError(statusError.message);
    }
  };

  return (
    <DataSection title="Booking Requests">
      <Feedback loading={loading} error={error || actionError} message={message} empty={!loading && !approvals.length} />
      <DataTable
        columns={['Booking ID', 'Renter ID', 'Pickup Date', 'Return Date', 'Approval Status', 'Comments']}
        rows={approvals.map((approval) => {
          const booking = approval.booking || {};
          return [
            shortId(getObjectId(booking)),
            shortId(getObjectId(booking.renter)),
            formatDate(booking.pickupDate),
            formatDate(booking.returnDate),
            <Status key={approval._id} value={titleCase(approval.approvalStatus)} />,
            approval.comments || (
              <ActionPair
                key={`${approval._id}-actions`}
                approve={() => updateStatus(approval, 'approved')}
                reject={() => updateStatus(approval, 'rejected')}
              />
            ),
          ];
        })}
      />
    </DataSection>
  );
}

function RenterProfilePage() {
  return <UserProfileSection title="Renter Profile" fallbackAvatar={peopleImages.renter} renterFields />;
}

function RenterSearchCarsPage() {
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (values) => {
    setMessage('');
    setError('');

    try {
      const payload = await apiRequest('/api/renters/search', {
        method: 'POST',
        body: JSON.stringify({
          searchKeyword: values.searchKeyword || '',
          pickupDate: values.pickupDate || new Date().toISOString().slice(0, 10),
          returnDate: values.returnDate || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        }),
      });
      setResults(mapCars(payload.cars || []));
      setMessage(`${payload.count || 0} cars found.`);
    } catch (searchError) {
      setError(searchError.message);
    }
  };

  return (
    <DataSection title="Search Cars">
      <Feedback message={message} error={error} />
      <SearchFilters onSubmit={handleSearch} />
      {results.length > 0 && <CarCards cars={results} />}
    </DataSection>
  );
}

function RenterBrowseCarsPage() {
  const { cars, loading, error } = useCars('/api/cars?available=true');

  return (
    <DataSection title="Browse Cars">
      <Feedback loading={loading} error={error} empty={!loading && !cars.length} />
      <CarCards cars={cars} />
    </DataSection>
  );
}

function RenterBookCarPage() {
  const { cars, loading, error, refresh } = useCars('/api/cars?available=true');
  const [message, setMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (values) => {
    setMessage('');
    setSubmitError('');

    try {
      await apiRequest('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          carId: values.carId,
          pickupDate: values.pickupDate,
          returnDate: values.returnDate,
        }),
      });
      setMessage('Booking request submitted.');
      refresh();
    } catch (bookingError) {
      setSubmitError(bookingError.message);
    }
  };

  return (
    <DataSection title="Book Car">
      <Feedback loading={loading} error={error || submitError} message={message} />
      <SimpleForm
        fields={[
          ['Car ID', 'select', cars.map((car) => ({ label: `${car.carName} (${shortId(car.id)})`, value: car.id })), 'carId'],
          ['Pickup Date', 'date', undefined, 'pickupDate'],
          ['Return Date', 'date', undefined, 'returnDate'],
        ]}
        buttonText="Book Car"
        onSubmit={handleSubmit}
      />
    </DataSection>
  );
}

function RenterBookingHistoryPage() {
  const { bookings, loading, error } = useBookings();

  return (
    <DataSection title="Booking History">
      <Feedback loading={loading} error={error} empty={!loading && !bookings.length} />
      <DataTable
        columns={['Booking ID', 'Car ID', 'Pickup Date', 'Return Date', 'Booking Status', 'Created At']}
        rows={bookings.map((booking) => [
          shortId(booking._id),
          booking.car?.carName || shortId(getObjectId(booking.car)),
          formatDate(booking.pickupDate),
          formatDate(booking.returnDate),
          <Status key={booking._id} value={titleCase(booking.bookingStatus)} />,
          formatDateTime(booking.createdAt),
        ])}
      />
    </DataSection>
  );
}

function RenterCancelBookingPage() {
  const { bookings, loading, error, refresh } = useBookings();
  const cancellable = bookings.filter((booking) => !['cancelled', 'completed', 'rejected'].includes(booking.bookingStatus));
  const [message, setMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (values) => {
    setMessage('');
    setSubmitError('');

    try {
      await apiRequest(`/api/bookings/${values.bookingId}/cancel`, { method: 'PATCH' });
      setMessage('Booking cancelled.');
      refresh();
    } catch (cancelError) {
      setSubmitError(cancelError.message);
    }
  };

  return (
    <DataSection title="Cancel Booking">
      <Feedback loading={loading} error={error || submitError} message={message} />
      <SimpleForm
        fields={[
          ['Booking ID', 'select', cancellable.map((booking) => ({ label: shortId(booking._id), value: booking._id })), 'bookingId'],
          ['Booking Status', 'select', ['Cancel Requested', 'Cancelled'], 'bookingStatus'],
        ]}
        buttonText="Cancel Booking"
        onSubmit={handleSubmit}
      />
    </DataSection>
  );
}

function UserProfileSection({ fallbackAvatar, ownerFields, renterFields, title }) {
  const [editing, setEditing] = useState(false);
  const [localUser, setLocalUser] = useState(getCurrentUser());
  const { data, loading, error, refresh } = useApiData('/api/profile/me');
  const currentUser = { ...localUser, ...(data?.profile?.user || {}), ...(data?.user || {}) };
  const profile = { ...emptyProfile, ...currentUser, ...(data?.profile || {}) };
  const avatar = profile.profileImage ? resolveAssetUrl(profile.profileImage) : fallbackAvatar;

  const fields = [
    ownerFields && ['Owner ID', shortId(currentUser?.id || currentUser?._id)],
    ['Username', currentUser?.username || 'Not available'],
    ['Full Name', profile.fullName || currentUser?.username || 'Not available'],
    ['Email', profile.email || currentUser?.email || 'Not available'],
    ['Mobile Number', profile.mobileNumber || currentUser?.mobileNumber || 'Not available'],
    ['Date of Birth', formatDate(profile.dateOfBirth)],
    ['Gender', profile.gender ? titleCase(profile.gender.replace(/_/g, ' ')) : 'Not available'],
    ['Address', profile.address || 'Not available'],
    ['Role', titleCase(currentUser?.role || '') || 'Not available'],
  ].filter(Boolean);

  const handleSaved = (updatedProfile, updatedUser) => {
    setLocalUser(updatedUser || getCurrentUser());
    setEditing(false);
    refresh();
    window.dispatchEvent(new Event('drivehub:profile-updated'));
  };

  return (
    <DataSection
      title={title}
      action={
        !editing && (
          <button type="button" className="btn btn--primary" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )
      }
    >
      <Feedback loading={loading} error={error} />
      {editing ? (
        <EditProfile
          fallbackAvatar={fallbackAvatar}
          onCancel={() => setEditing(false)}
          onSaved={handleSaved}
          profile={profile}
          roleLabel={titleCase(currentUser?.role || '')}
          user={currentUser}
        />
      ) : (
        <ProfileGrid avatar={avatar} fields={fields} />
      )}
    </DataSection>
  );
}

function StatsGrid({ cards }) {
  return (
    <section className="stats-grid" id="overview" aria-label="Dashboard overview">
      {cards.map(([label, value]) => (
        <article className="stat-card" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </article>
      ))}
    </section>
  );
}

function DataSection({ action, children, title }) {
  return (
    <section className="dashboard-section" id={toId(title)}>
      <div className="dashboard-section__header">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CarTable({ cars, includeId = true }) {
  const columns = [
    includeId && 'Car ID',
    'Car Image',
    'Car Name',
    'Brand',
    'Model',
    'Vehicle Number',
    'Fuel Type',
    'Seating Capacity',
    'Rent Per Day',
    'Availability Status',
    'Description',
  ].filter(Boolean);

  return (
    <DataTable
      columns={columns}
      rows={cars.map((car) => {
        const row = [
          includeId && shortId(car.id),
          <img className="table-car-image" key={car.id} src={resolveAssetUrl(car.carImage)} alt={car.carName} />,
          car.carName,
          car.brand,
          car.model,
          car.vehicleNumber,
          titleCase(car.fuelType),
          car.seatingCapacity,
          formatCurrency(car.rentPerDay),
          <Status key={car.vehicleNumber} value={car.availabilityStatus} />,
          car.description,
        ];

        return row.filter(Boolean);
      })}
    />
  );
}

function CarCards({ allowDelete = false, cars, onDeleted }) {
  const [error, setError] = useState('');

  const deleteCar = async (carId) => {
    setError('');
    try {
      await apiRequest(`/api/cars/${carId}`, { method: 'DELETE' });
      onDeleted?.();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <>
      <Feedback error={error} />
      <div className="car-grid">
        {cars.map((car) => (
          <article className="car-card" key={car.id}>
            <img src={resolveAssetUrl(car.carImage)} alt={car.carName} />
            <div className="car-card__body">
              <div>
                <span className="eyebrow">{shortId(car.id)}</span>
                <h3>{car.carName}</h3>
                <p>{car.description}</p>
              </div>
              <dl>
                <div><dt>Brand</dt><dd>{car.brand}</dd></div>
                <div><dt>Model</dt><dd>{car.model}</dd></div>
                <div><dt>Vehicle Number</dt><dd>{car.vehicleNumber}</dd></div>
                <div><dt>Fuel Type</dt><dd>{titleCase(car.fuelType)}</dd></div>
                <div><dt>Seating Capacity</dt><dd>{car.seatingCapacity}</dd></div>
                <div><dt>Rent Per Day</dt><dd>{formatCurrency(car.rentPerDay)}</dd></div>
                <div><dt>Availability Status</dt><dd><Status value={car.availabilityStatus} /></dd></div>
              </dl>
              {allowDelete && (
                <button type="button" className="btn btn--primary" onClick={() => deleteCar(car.id)}>
                  Delete Car
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function ProfileGrid({ avatar, fields }) {
  return (
    <div className="profile-grid">
      {avatar && <img className="profile-grid__avatar" src={avatar} alt="Profile" />}
      <div className="profile-grid__fields">
        {fields.map(([label, value]) => (
          <div className="profile-field" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function CarForm({ onSubmit }) {
  return (
    <SimpleForm
      fields={[
        ['Car Name', 'text', undefined, 'carName'],
        ['Brand', 'text', undefined, 'brand'],
        ['Model', 'text', undefined, 'model'],
        ['Vehicle Number', 'text', undefined, 'vehicleNumber'],
        ['Fuel Type', 'select', ['Petrol', 'Diesel', 'Electric'], 'fuelType'],
        ['Seating Capacity', 'number', undefined, 'seatingCapacity'],
        ['Rent Per Day', 'number', undefined, 'rentPerDay'],
        ['Availability Status', 'select', ['Available', 'Booked', 'Maintenance'], 'availabilityStatus'],
        ['Car Image', 'file', undefined, 'carImage'],
        ['Description', 'textarea', undefined, 'description'],
      ]}
      buttonText="Add Car"
      onSubmit={onSubmit}
    />
  );
}

function SearchFilters({ onSubmit }) {
  return (
    <SimpleForm
      fields={[
        ['Search Keyword', 'text', undefined, 'searchKeyword'],
        ['Pickup Date', 'date', undefined, 'pickupDate'],
        ['Return Date', 'date', undefined, 'returnDate'],
        ['Fuel Type Filter', 'select', ['Any Fuel', 'Petrol', 'Diesel', 'Electric'], 'fuelType'],
        ['Seating Capacity Filter', 'select', ['Any Seats', '4', '5', '7'], 'seatingCapacity'],
        ['Rent Per Day Filter', 'select', ['Any Price', 'Under Rs. 2,500', 'Rs. 2,500 - Rs. 5,000', 'Above Rs. 5,000'], 'rentPerDay'],
      ]}
      buttonText="Search Cars"
      onSubmit={onSubmit}
    />
  );
}

function SimpleForm({ buttonText, fields, onSubmit }) {
  const initialValues = useMemo(
    () => Object.fromEntries(fields.map(([label, , , name]) => [name || toName(label), ''])),
    [fields],
  );
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (event) => {
    const { files, name, type, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === 'file' ? files?.[0] || null : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit?.(values);
    setValues(initialValues);
    event.currentTarget.reset();
  };

  return (
    <form className="dashboard-form" onSubmit={handleSubmit}>
      {fields.map(([label, type, options, nameOverride]) => {
        const name = nameOverride || toName(label);

        return (
          <label key={label}>
            <span>{label}</span>
            {type === 'select' ? (
              <select name={name} value={values[name] || ''} onChange={handleChange}>
                <option value="" disabled>
                  Select {label}
                </option>
                {options.map((option) => {
                  const normalized = typeof option === 'object' ? option : { label: option, value: option };
                  return (
                    <option key={normalized.value} value={normalized.value}>
                      {normalized.label}
                    </option>
                  );
                })}
              </select>
            ) : type === 'textarea' ? (
              <textarea name={name} rows="4" placeholder={`Enter ${label.toLowerCase()}`} value={values[name] || ''} onChange={handleChange} />
            ) : (
              <input name={name} type={type} placeholder={type === 'file' ? undefined : `Enter ${label.toLowerCase()}`} onChange={handleChange} />
            )}
          </label>
        );
      })}
      <button className="btn btn--primary" type="submit">
        {buttonText}
      </button>
    </form>
  );
}

function ActionPair({ approve, reject }) {
  return (
    <span className="role-navbar__actions">
      <button type="button" className="btn btn--primary" onClick={approve}>
        Approve
      </button>
      <button type="button" className="btn btn--primary" onClick={reject}>
        Reject
      </button>
    </span>
  );
}

function Feedback({ empty, error, loading, message }) {
  if (!loading && !error && !message && !empty) return null;

  return (
    <div className="profile-grid">
      {loading && <div className="profile-field"><span>Status</span><strong>Loading backend data...</strong></div>}
      {error && <div className="profile-field"><span>Status</span><strong>{error}</strong></div>}
      {message && <div className="profile-field"><span>Status</span><strong>{message}</strong></div>}
      {empty && <div className="profile-field"><span>Status</span><strong>No records found.</strong></div>}
    </div>
  );
}

function Avatar({ label, src }) {
  return <img className="table-avatar" src={src} alt={label} />;
}

function Status({ value }) {
  const label = typeof value === 'boolean' ? (value ? 'Available' : 'Booked') : value || 'Not available';
  return <span className={`status-pill status-pill--${toId(label)}`}>{label}</span>;
}

function useApiData(path) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });

  const load = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    apiRequest(path)
      .then((data) => setState({ data, loading: false, error: '' }))
      .catch((error) => setState({ data: null, loading: false, error: error.message }));
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, refresh: load };
}

function useCars(path = '/api/cars') {
  const { data, loading, error, refresh } = useApiData(path);
  return { cars: mapCars(data?.cars || []), loading, error, refresh };
}

function useBookings(path = '/api/bookings') {
  const { data, loading, error, refresh } = useApiData(path);
  return { bookings: data?.bookings || [], loading, error, refresh };
}

function mapCars(cars) {
  return cars.map((car, index) => ({
    id: car._id || car.id,
    carName: car.carName || 'Unnamed Car',
    brand: car.brand || 'Not available',
    model: car.model || 'Not available',
    vehicleNumber: car.vehicleNumber || 'Not available',
    fuelType: car.fuelType || 'Not available',
    seatingCapacity: car.seatingCapacity || 'Not available',
    rentPerDay: car.rentPerDay || 0,
    availabilityStatus: car.availabilityStatus,
    carImage: car.carImage ? resolveAssetUrl(car.carImage) : Object.values(carImages)[index % Object.values(carImages).length],
    description: car.description || 'No description provided.',
  }));
}

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;
}

function formatDate(value) {
  if (!value) return 'Not available';
  return new Date(value).toISOString().slice(0, 10);
}

function formatDateTime(value) {
  if (!value) return 'Not available';
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function getObjectId(value) {
  return value?._id || value?.id || value || '';
}

function normalizeFuel(value) {
  const normalized = value?.toLowerCase?.();
  if (normalized === 'hybrid') return 'electric';
  return normalized || 'petrol';
}

function shortId(value) {
  if (!value) return 'Not available';
  const raw = String(value);
  return raw.length > 10 ? raw.slice(-8).toUpperCase() : raw.toUpperCase();
}

function titleCase(value) {
  return String(value || '')
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function toName(value) {
  return toId(value).replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function toId(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export {
  AdminBookingsPage,
  AdminCarsPage,
  AdminDashboard,
  AdminOverviewPage,
  AdminProfilePage,
  AdminUsersPage,
  OwnerAddCarPage,
  OwnerBookingRequestsPage,
  OwnerCarsPage,
  OwnerDashboard,
  OwnerProfilePage,
  RenterBookCarPage,
  RenterBookingHistoryPage,
  RenterBrowseCarsPage,
  RenterCancelBookingPage,
  RenterDashboard,
  RenterProfilePage,
  RenterSearchCarsPage,
};
export default Dashboard;
