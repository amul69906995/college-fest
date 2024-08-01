# College Fest Entry System

This project is designed to facilitate smooth entry and single-time verification using QR codes for a college fest. Users with a college email ID can sign in and generate a QR code, which is valid for one-time scanning only. The system includes roles for users, volunteers, and admins, with various permissions and functionalities.

## Project Features
- **User Sign-In**: Users can sign in with their college email ID.
- **QR Code Generation**: Users can generate a QR code if the admin has granted permission for a specific fest.
- **Admin Control**: Admins can add and remove volunteers, and manage QR code generation permissions.
- **QR Code Scanning**: Both volunteers and admins can scan QR codes to authenticate entries. QR codes are valid for one-time use only.
- **Email Notifications**: QR codes can be shown in the app or sent via email to the user's college email.

## Environments

### Backend Environment Variables
Create a `.env` file in the backend directory and add the following:
MONGO_URI=<your_mongo_uri>
FRONTEND_URL=http://localhost:5173
JWT_SECRET=<your_jwt_secret>
PORT=8000
JWT_QR_SECRET=<your_jwt_qr_secret>
GMAIL_USER=<your_gmail_user>
GMAIL_PASS=<your_gmail_pass>
GMAIL_PORT=<your_gmail_port>
### Frontend Environment Variables
Create a `.env` file in the frontend directory and add the following:
VITE_BACKEND_URL=http://localhost:8000
## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- MongoDB

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/amul69906995/college-fest.git
    cd college-fest
    ```

2. **Set up the backend**:
    ```bash
    cd backend
    npm install
    ```

3. **Set up the frontend**:
    ```bash
    cd frontend
    npm install
    ```

### Running the Application

1. **Start the backend server**:
    ```bash
    cd backend
    npm start
    ```

2. **Start the frontend server**:
    ```bash
    cd frontend
    npm run dev
    ```

### Application URLs
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

## Usage

1. **Admin**:
    - Sign in and manage permissions for QR code generation.
    - Add or remove volunteers.
    - Scan QR codes to authenticate users.

2. **Volunteer**:
    - Sign in to scan and authenticate QR codes.

3. **User**:
    - Sign in with college email ID.
    - Generate QR code if allowed by admin.
    - Display QR code in the app or receive it via email.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License
This project is licensed under the MIT License.
