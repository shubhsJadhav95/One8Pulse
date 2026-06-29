# One8Pulse - Premium Fitness Application

A modern, high-end fitness tracking application built with microservices architecture and a premium React frontend. Features activity tracking, AI-powered recommendations, and a beautiful responsive UI.

## 🏗️ Architecture

### Microservices Architecture
- **Eureka Server** - Service Discovery (Port: 8761)
- **Config Server** - Centralized Configuration (Port: 8888)
- **API Gateway** - Gateway for all external requests (Port: 8080)
- **User Service** - User management & authentication (Port: 8081)
- **Activity Service** - Activity tracking & management (Port: 8082)
- **AI Service** - AI-powered recommendations (Port: 8083)

### Tech Stack

#### Backend
- **Java 17+** with Spring Boot
- **Spring Cloud** for microservices
- **Spring Security** with JWT authentication
- **MongoDB** for data persistence
- **RabbitMQ** for message queuing (optional)
- **Eureka** for service discovery
- **Spring Cloud Gateway** for API routing

#### Frontend
- **React 18+** with Vite
- **Redux Toolkit** for state management
- **Material-UI (MUI)** for UI components
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MongoDB (local or cloud instance)
- RabbitMQ (optional, for message queuing)
- Maven

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd one8pulse
```

2. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use the cloud MongoDB connection string in config files
```

3. **Start RabbitMQ** (Optional - for message queuing between services)
```bash
# Using Docker
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Or install RabbitMQ locally
# Download from https://www.rabbitmq.com/download.html
# Start the RabbitMQ service
# Management UI: http://localhost:15672 (default: guest/guest)
```

**Note**: RabbitMQ is optional. The AI Service can run without it by setting `rabbitmq.enabled=false` in configuration.

4. **Start Eureka Server**
```bash
cd eureka
mvn spring-boot:run
```
- Access at: http://localhost:8761

5. **Start Config Server**
```bash
cd configserver
mvn spring-boot:run
```
- Access at: http://localhost:8888

6. **Start User Service**
```bash
cd userservice
mvn spring-boot:run
```
- Access at: http://localhost:8081

7. **Start Activity Service**
```bash
cd activityservice
mvn spring-boot:run
```
- Access at: http://localhost:8082

8. **Start AI Service** (Optional)
```bash
cd aiservice
mvn spring-boot:run
```
- Access at: http://localhost:8083

9. **Start API Gateway**
```bash
cd gateway
mvn spring-boot:run
```
- Access at: http://localhost:8080

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd one8pulse-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```
- Access at: http://localhost:5174

## 🔑 Configuration

### Environment Variables

#### Backend Services
- **JWT Secret**: Used for token generation and validation
- **MongoDB URI**: Connection string for MongoDB
- **Gemini API Key**: For AI recommendations (AI Service)
- **RabbitMQ Configuration**: Optional message queue setup
  - `rabbitmq.enabled`: Enable/disable RabbitMQ (default: false)
  - `spring.rabbitmq.host`: RabbitMQ host (default: localhost)
  - `spring.rabbitmq.port`: RabbitMQ port (default: 5672)
  - `spring.rabbitmq.username`: RabbitMQ username (default: guest)
  - `spring.rabbitmq.password`: RabbitMQ password (default: guest)

#### Frontend
- **API Base URL**: http://localhost:8080 (Gateway URL)
- **JWT Token**: Stored in localStorage after login

### Configuration Files
- Backend configs are in `configserver/src/main/resources/config/`
- Service-specific configs: `user-service.yml`, `activity-service.yml`, `api-gateway.yml`, `ai-service.yml`

### Frontend Structure
```
one8pulse-frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx          # Login page with forgot password link
│   │   │   ├── Register.jsx       # Registration with password strength
│   │   │   ├── ForgotPassword.jsx # Forgot password page
│   │   │   └── ResetPassword.jsx  # Reset password with token
│   │   ├── activities/
│   │   │   ├── ActivityList.jsx   # Activity listing page
│   │   │   ├── ActivityForm.jsx   # Create new activity
│   │   │   └── ActivityDetail.jsx # Activity details with AI recommendations
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx      # Main dashboard
│   │   ├── profile/
│   │   │   └── Profile.jsx       # User profile management
│   │   ├── layout/
│   │   │   └── Navbar.jsx        # Navigation with theme toggle
│   │   └── onboarding/
│   │       ├── SplashScreen.jsx  # Animated splash screen
│   │       └── Onboarding.jsx    # Onboarding flow
│   ├── context/
│   │   └── ThemeContext.jsx      # Theme management context
│   ├── services/
│   │   ├── api.js                # API service calls
│   │   └── authService.js        # Authentication service
│   ├── store/
│   │   ├── authSlice.js          # Redux auth state
│   │   └── store.js              # Redux store configuration
│   ├── theme/
│   │   └── theme.js              # Material-UI theme configuration
│   ├── App.jsx                   # Main app with routing
│   └── main.jsx                  # App entry point
```

## ✨ Key Features

### User Features
- **User Registration & Authentication**
  - Email/password registration
  - JWT-based authentication
  - **Password Reset Functionality**
    - Forgot password flow with email verification
    - Secure token-based password reset
    - Reset password page with token validation
    - Frontend routes: `/forgot-password` and `/reset-password/:token`
  - Secure session management

- **Activity Tracking**
  - Log various activity types (Running, Walking, Cycling, Swimming, Yoga, HIIT, etc.)
  - Track duration, calories burned, and custom metrics
  - View activity history with detailed statistics
  - Filter activities by type

- **AI-Powered Recommendations**
  - Get personalized fitness recommendations
  - Activity-specific insights and tips
  - Powered by Google Gemini AI

- **Profile Management**
  - View and edit user profile
  - Track personal statistics
  - Manage account information

### UI/UX Features
- **Premium Design**
  - Modern, clean interface
  - Glassmorphism effects
  - Soft gradients and animations
  - Rounded corners and spacious layouts

- **Authentication Pages**
  - Login page with forgot password link
  - Registration page with password strength indicator
  - **Forgot Password page** - Email submission for password reset
  - **Reset Password page** - Secure password reset with token validation

- **Dark/Light Mode**
  - Toggle between themes
  - Automatic system preference detection
  - Persistent theme selection

- **Responsive Design**
  - Mobile-first approach
  - Optimized for all screen sizes (320px+)
  - Touch-friendly controls
  - Adaptive typography

- **Smooth Animations**
  - Page transitions with Framer Motion
  - Micro-interactions
  - Loading states
  - Ripple effects on buttons

- **Onboarding Experience**
  - Animated splash screen
  - Multi-step onboarding flow
  - Skip option for returning users
  - Motivational content

## 🔐 Security

### Authentication
- JWT tokens for authentication
- Token expiration: 10 hours
- Secure password storage
- Protected routes for authenticated users

### API Security
- Spring Security configuration
- JWT validation in API Gateway
- CORS configuration
- User ID propagation through headers

## 📡 API Endpoints

### Authentication (via Gateway)
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password/{token}` - Reset password

### Activities (via Gateway)
- `GET /api/activities` - Get all user activities
- `POST /api/activities` - Create new activity
- `GET /api/activities/{id}` - Get activity details
- `GET /api/activities/{id}/recommendations` - Get AI recommendations

### User Profile (via Gateway)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🗄️ Database Schema

### MongoDB Collections

#### Users Collection
```json
{
  "userId": "string (UUID)",
  "email": "string",
  "password": "string (hashed)",
  "name": "string",
  "createdAt": "date"
}
```

#### Activities Collection
```json
{
  "id": "string (UUID)",
  "userId": "string",
  "type": "string (RUNNING, WALKING, etc.)",
  "duration": "number (minutes)",
  "caloriesBurned": "number",
  "startTime": "date",
  "metrics": {
    "avgHeartRate": "number",
    "distance": "number",
    "avgPace": "number",
    "elevationGain": "number"
  },
  "createdAt": "date"
}
```

#### Recommendations Collection
```json
{
  "id": "string",
  "userId": "string",
  "activityId": "string",
  "recommendations": "array",
  "createdAt": "date"
}
```

## 🧪 Testing

### Backend Testing
```bash
# Run tests for individual services
cd <service-directory>
mvn test
```

### Frontend Testing
```bash
cd one8pulse-frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Build each service: `mvn clean package`
2. Deploy JAR files to your server
3. Ensure MongoDB is accessible
4. Configure environment variables
5. Start services in order: Eureka → Config → Services → Gateway

### Frontend Deployment
```bash
cd one8pulse-frontend
npm run build
```
Deploy the `dist` folder to your web server or hosting platform.

## 🐛 Troubleshooting

### Common Issues

**Services not starting**
- Check if Eureka is running first
- Verify Config Server is accessible
- Check port conflicts

**Frontend not connecting to backend**
- Verify API Gateway is running
- Check CORS configuration
- Ensure JWT token is valid

**AI Service not working**
- Check Gemini API key configuration
- Verify MongoDB connection
- Service can run without AI features if disabled

**State management issues**
- Clear localStorage if authentication issues persist
- Check Redux DevTools for state updates
- Verify JWT token is being stored correctly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Shubh Jadhav** - Lead Developer

## 🙏 Acknowledgments

- Material-UI for the excellent UI components
- Framer Motion for smooth animations
- Spring Boot for the robust backend framework
- Google Gemini AI for recommendation engine

## 📞 Support

For issues and questions, please open an issue in the repository or contact the development team.

---

**One8Pulse** - Your Premium Fitness Companion 🏃‍♂️💪
