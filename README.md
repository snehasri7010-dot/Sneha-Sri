# Car Rental System Backend

Node.js, Express, and MongoDB backend generated from `Car_Rental_System_Modules_Fields.docx`.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from the example:

```bash
copy .env.example .env
```

3. Update `MONGODB_URI` and `JWT_SECRET` in `.env`.

4. Start the API:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

## Main Modules

- Authentication: register, login, current user
- User Profile: full name, email, mobile number, DOB, gender, address, profile image
- Car Management: owner cars, vehicle details, rent, availability, car image
- Renter: car search with pickup/return dates
- Booking Management: create booking, owner/admin status updates, cancellation
- Car Owner: owner approvals and owner booking list
- Admin: dashboard, user management, settings, reports

## Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Profiles

- `GET /api/profile/me`
- `PUT /api/profile/me`
- `GET /api/profile/:userId` admin only

### Cars

- `GET /api/cars`
- `GET /api/cars/:id`
- `GET /api/cars/my-cars`
- `POST /api/cars` owner/admin only
- `PUT /api/cars/:id` owner/admin only
- `DELETE /api/cars/:id` owner/admin only

### Renters

- `POST /api/renters/search`
- `GET /api/renters/searches`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings`
- `GET /api/bookings/:id`
- `PATCH /api/bookings/:id/status` owner/admin only
- `PATCH /api/bookings/:id/cancel` renter only

### Owners

- `GET /api/owners/approvals`
- `GET /api/owners/bookings`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/status`
- `PUT /api/admin/settings`
- `GET /api/admin/reports`

## Image Upload Fields

Use `multipart/form-data` for image uploads:

- Profile image field: `profileImage`
- Car image field: `carImage`

## Example Register Body

```json
{
  "username": "john",
  "email": "john@example.com",
  "mobileNumber": 9876543210,
  "password": "secret123",
  "confirmPassword": "secret123",
  "role": "renter",
  "fullName": "John Doe",
  "address": "Main Street"
}
```
