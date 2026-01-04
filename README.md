# Vehicle Rental System

## Live URL
 https://actual-work-file.vercel.app/

## Features
The Vehicle Rental System is a robust backend API designed to manage vehicle rentals efficiently. Key features include:

- **User Authentication**: Secure signup and signin functionality using JWT tokens and password hashing with bcrypt.
- **Vehicle Management**: Comprehensive CRUD operations for vehicles, with admin-only access for creation, updates, and deletions. Public access for viewing vehicle listings and details.
- **User Management**: Admin-controlled user operations, including viewing all users, updating user information (admin or self), and deleting users.
- **Booking System**: Allows customers and admins to create, view, and update bookings for vehicles.
- **Role-Based Access Control**: Differentiated permissions for admin and customer roles to ensure secure API interactions.
- **Database Integration**: PostgreSQL database for persistent data storage.
- **Middleware Support**: Includes authentication middleware and logging for enhanced security and monitoring.

## Technology Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT), bcryptjs for password hashing
- **Environment Management**: dotenv for configuration
- **Development Tools**: tsx for TypeScript execution, TypeScript compiler

## Setup & Usage Instructions

### Prerequisites
- Node.js (version 14 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd vehicle-rental-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   CONNECTION_STR=your_postgresql_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```

4. Initialize the database:
   Ensure your PostgreSQL database is running and the connection string is correctly set.

### Running the Application
- **Development Mode**:
  ```
  npm run dev
  ```
  This starts the server with hot reloading using tsx.

- **Production Build**:
  ```
  npm run build
  npm start
  ```
  Builds the TypeScript code and starts the server from the compiled JavaScript.

The server will run on the specified port (default: 5000).

### API Endpoints
- **Authentication**:
  - `POST /api/v1/auth/signup` - User registration
  - `POST /api/v1/auth/signin` - User login

- **Vehicles**:
  - `POST /api/v1/vehicles` - Create vehicle (Admin)
  - `GET /api/v1/vehicles` - Get all vehicles
  - `GET /api/v1/vehicles/:vehicleId` - Get vehicle by ID
  - `PUT /api/v1/vehicles/:vehicleId` - Update vehicle (Admin)
  - `DELETE /api/v1/vehicles/:vehicleId` - Delete vehicle (Admin)

- **Users**:
  - `GET /api/v1/users` - Get all users (Admin)
  - `PUT /api/v1/users/:userId` - Update user (Admin or self)
  - `DELETE /api/v1/users/:userId` - Delete user (Admin)

- **Bookings**:
  - `POST /api/v1/bookings` - Create booking (Customer/Admin)
  - `GET /api/v1/bookings` - Get all bookings (Customer/Admin)
  - `PUT /api/v1/bookings/:bookingId` - Update booking (Customer/Admin)

## Live Deployment
The application is deployed and accessible at:  https://actual-work-file.vercel.app/

