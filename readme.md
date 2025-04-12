# AgroSense App

AgroSense is a smart water management mobile application designed to assist farmers in optimizing water usage through IoT technologies. This app serves as the frontend for the AgroSense Backend, which provides RESTful APIs for user management, farm management, sensor registration, and real-time measurement tracking.

## Features

### User Management
- User registration and login using email and password.
- Token-based authentication using Laravel Sanctum.
- Logout functionality.

### Farm Management
- Create, update, view, and delete farms.
- Store farm boundaries using GPS coordinates.
- Visualize farm boundaries on an interactive map.

### Sensor Management
- Register sensors by scanning QR codes.
- Automatically associate sensors with farms.
- Update sensor details when scanned again.
- View and delete sensors.

### Measurement Management (TODO)
- Post real-time measurements (e.g., humidity) from sensors.
- Store measurements in the database for analysis.
- View historical measurements for sensors.

## Tech Stack

- **Frontend**: NativeScript with Vue.js
- **Backend**: Laravel (AgroSense Backend)
- **Authentication**: Laravel Sanctum
- **Mapping**: Mapbox
- **Database**: MySQL (via backend)

 ## Installation

### Prerequisites
- Node.js (v16 or higher)
- NativeScript CLI
- Access to the AgroSense Backend API
- Android Studio or Xcode (for Android/iOS development)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/agrosenseApp.git
   cd agrosenseApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the NativeScript environment:
   Follow the [NativeScript environment setup guide](https://docs.nativescript.org/environment-setup).

4. Create a `.env` file in the root directory and configure the following:
   ```env
   VUE_APP_BASE_URL=http://your-backend-url/api
   MAPBOX_ACCESS_TOKEN=your_mapbox_public_access_token
   MAPBOX_DOWNLOADS_TOKEN=your_mapbox_downloads_token
   ```

5. Run the app on an emulator or device:
   - For Android:
     ```bash
     ns run android
     ```
   - For iOS:
     ```bash
     ns run ios
     ```

6. (Optional) Build the app for production:
   - For Android:
     ```bash
     ns build android --release
     ```
   - For iOS:
     ```bash
     ns build ios --release
     ```

## Usage

1. **Register or Login**: Create an account or log in using your credentials.
2. **Manage Farms**: Add farms by entering their details and capturing GPS boundaries.
3. **Register Sensors**: Scan QR codes to register sensors and associate them with farms.
4. **Post Measurements**: Send real-time measurements from sensors to the backend.
5. **View Data**: Visualize farms, sensors, and historical measurements.

## Backend Integration

This app integrates with the AgroSense Backend, which provides the following API endpoints:
- `/api/register`: User registration
- `/api/login`: User login
- `/api/logout`: User logout
- `/api/farms`: Farm management
- `/api/farms/{farm}/sensors`: Get Farms Sensor

For more details, refer to the [AgroSense Backend documentation](https://github.com/AgroSensePlatform/agrosense-server).


