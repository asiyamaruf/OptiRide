# OptiRide - Project Context Document

## Project Overview

OptiRide is a multi-role transportation and delivery platform built with React Native (Expo) that serves three distinct user types: Passengers, Grocery Customers, and Drivers. The application enables ride-sharing services and grocery delivery through a unified platform with optimized route planning capabilities.

**Tech Stack:**
- Frontend: React Native with Expo Router
- Framework: Expo SDK ~54.0.24
- Navigation: Expo Router (file-based routing)
- Backend: FastAPI (referenced, separate repository)
- Database: PostgreSQL

---

## Existing Features (Legacy/Initial Implementation)

### 1. **Role-Based Navigation**
- Three-role selection system (Passenger, Grocery Customer, Driver)
- Separate navigation flows for each user type
- Basic routing structure with Expo Router

### 2. **Passenger Module**
- Passenger home page
- Ride booking interface with pickup and drop location inputs
- Ride request submission to backend API
- Success confirmation page
- Basic map integration (map.js file exists)

### 3. **Grocery Customer Module**
- Grocery home page
- Product browsing interface with product list
- Product selection functionality
- Delivery address input page
- Delivery request submission

### 4. **Driver Module**
- Driver login page (phone number based)
- Driver tasks dashboard
- Task list display with request details (type, ID, sequence, status)
- Backend API integration for fetching driver tasks

### 5. **Backend Integration**
- API configuration file (`app/config/api.js`)
- Base URL configuration for backend endpoints
- API endpoints:
  - `/request-ride` - Passenger ride requests
  - `/request-delivery` - Grocery delivery requests
  - `/driver-tasks/{driver_id}` - Driver task retrieval

### 6. **UI/UX Foundation**
- Consistent styling across modules
- Modern, clean design with blue color scheme (#4A90E2)
- Responsive layouts with proper spacing
- Card-based components for data display

---

## Current Features (Recently Implemented)

### 1. **Authentication System** ✨ NEW
- **Login Page** (`app/index.js`)
  - Email and password authentication
  - Form validation
  - Navigation to role selection after login
  - Signup link integration
  
- **Signup Page** (`app/signup.js`)
  - User registration form
  - Fields: Full Name, Email, Phone Number, Password
  - Form validation
  - Navigation back to login after signup
  
- **Authentication Flow**
  - Login page as initial route
  - Post-login redirect to role selection
  - Signup/login navigation flow

### 2. **Enhanced Navigation Structure**
- Root-level login page (`app/index.js`)
- Role selection page (`app/home.js`) - separated from tabs
- Improved routing hierarchy
- Fixed navigation conflicts between login and role selection

### 3. **User Experience Improvements**
- Consistent authentication UI matching app design
- Error handling and validation messages
- Smooth navigation transitions
- Proper route management

---

## Current Application Structure

```
app/
├── index.js              # Login page (initial route)
├── signup.js             # User registration
├── home.js               # Role selection (Passenger/Grocery/Driver)
├── _layout.tsx           # Root layout with Stack navigator
├── (tabs)/               # Tab navigation (currently minimal)
│   ├── index.js          # Legacy role selection (deprecated)
│   └── explore.tsx       # Explore tab
├── passenger/
│   ├── home.js           # Passenger dashboard
│   ├── ride.js           # Book ride (pickup/drop)
│   ├── success.js        # Ride confirmation
│   └── map.js            # Map integration (exists)
├── grocery/
│   ├── home.js           # Grocery dashboard
│   ├── products.js       # Browse products
│   └── address.js        # Delivery address input
├── driver/
│   ├── login.js          # Driver authentication
│   ├── tasks.js          # Driver task list
│   └── details.js        # Driver details (exists)
└── config/
    └── api.js            # Backend API configuration
```

---

## Backend API Endpoints (Referenced)

Based on code analysis, the following endpoints are expected:

1. **Authentication** (TODO - Not yet implemented)
   - `POST /login` - User login
   - `POST /signup` - User registration

2. **Passenger Services**
   - `POST /request-ride` - Submit ride request
     - Body: `{ user_id, pickup, drop }`

3. **Grocery Services**
   - `POST /request-delivery` - Submit grocery delivery
     - Body: `{ user_id, products, address }`

4. **Driver Services**
   - `GET /driver-tasks/{driver_id}` - Get driver's assigned tasks
     - Returns: `{ tasks: [...] }`

---

## Future Scope & Enhancement Opportunities

### 1. **Authentication & Security** 🔐
- [ ] Complete backend authentication API integration
- [ ] JWT token-based authentication
- [ ] Session management and token refresh
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Social login (Google, Facebook)
- [ ] Biometric authentication (Face ID, Fingerprint)
- [ ] Two-factor authentication (2FA)

### 2. **Passenger Features** 🚖
- [ ] Real-time ride tracking with map integration
- [ ] Driver location tracking
- [ ] Estimated time of arrival (ETA)
- [ ] Ride history and receipts
- [ ] Favorite locations/saved addresses
- [ ] Multiple payment methods integration
- [ ] Ride cancellation functionality
- [ ] Ride rating and review system
- [ ] Split fare functionality
- [ ] Scheduled rides
- [ ] Ride sharing with other passengers
- [ ] Price estimation before booking

### 3. **Grocery Customer Features** 🛒
- [ ] Complete product catalog with images
- [ ] Shopping cart functionality
- [ ] Product search and filtering
- [ ] Category-based browsing
- [ ] Product reviews and ratings
- [ ] Order history
- [ ] Reorder functionality
- [ ] Multiple delivery addresses management
- [ ] Delivery time slot selection
- [ ] Order tracking in real-time
- [ ] Payment integration
- [ ] Promotions and discount codes
- [ ] Wishlist functionality

### 4. **Driver Features** 🚗
- [ ] Complete driver profile management
- [ ] Vehicle information management
- [ ] Document upload (license, registration, insurance)
- [ ] Real-time location sharing
- [ ] Navigation integration (Google Maps, Waze)
- [ ] Task acceptance/rejection
- [ ] Task completion confirmation
- [ ] Earnings dashboard
- [ ] Performance metrics
- [ ] Availability toggle (online/offline)
- [ ] Route optimization suggestions
- [ ] Customer communication (chat/call)
- [ ] Emergency contact system

### 5. **Route Optimization** 🗺️
- [ ] Vehicle Routing Problem (VRP) algorithm implementation
- [ ] Multi-stop route optimization
- [ ] Real-time traffic integration
- [ ] Distance matrix calculation
- [ ] Dynamic route adjustment
- [ ] Batch request optimization
- [ ] Driver assignment algorithm
- [ ] Load balancing across drivers

### 6. **Real-Time Features** ⚡
- [ ] WebSocket integration for real-time updates
- [ ] Push notifications (ride status, order updates)
- [ ] Live driver tracking
- [ ] Real-time chat between users and drivers
- [ ] Live order tracking
- [ ] Emergency SOS feature
- [ ] Real-time traffic updates

### 7. **Payment Integration** 💳
- [ ] Multiple payment gateways (Stripe, PayPal, Razorpay)
- [ ] Wallet functionality
- [ ] Payment history
- [ ] Refund processing
- [ ] Promo codes and discounts
- [ ] Subscription plans (for drivers)
- [ ] Commission calculation and payout

### 8. **Admin Dashboard** 👨‍💼
- [ ] Admin panel for managing users, drivers, and orders
- [ ] Analytics and reporting
- [ ] Driver verification and approval
- [ ] Complaint management
- [ ] Pricing management
- [ ] Promotional campaign management
- [ ] System monitoring and health checks

### 9. **User Experience Enhancements** 🎨
- [ ] Dark mode support
- [ ] Multi-language support (i18n)
- [ ] Accessibility features (screen readers, high contrast)
- [ ] Onboarding tutorial for new users
- [ ] In-app help and support
- [ ] Feedback and rating system
- [ ] Referral program
- [ ] Loyalty points and rewards

### 10. **Advanced Features** 🚀
- [ ] AI-powered demand prediction
- [ ] Dynamic pricing based on demand
- [ ] Machine learning for route optimization
- [ ] Predictive maintenance for drivers
- [ ] Carbon footprint tracking
- [ ] Integration with public transport
- [ ] Corporate accounts and billing
- [ ] API for third-party integrations
- [ ] Web dashboard for management
- [ ] Mobile app for iOS and Android (native builds)

### 11. **Safety & Compliance** 🛡️
- [ ] Driver background verification
- [ ] Emergency contact system
- [ ] Ride sharing safety features
- [ ] Incident reporting
- [ ] Insurance integration
- [ ] Compliance with local regulations
- [ ] Data privacy (GDPR compliance)
- [ ] Terms of service and privacy policy

### 12. **Testing & Quality Assurance** ✅
- [ ] Unit testing (Jest)
- [ ] Integration testing
- [ ] End-to-end testing
- [ ] Performance testing
- [ ] Security testing
- [ ] Load testing for backend
- [ ] Automated testing pipeline (CI/CD)

---

## Technical Debt & Improvements Needed

1. **Backend Integration**
   - Complete authentication API endpoints
   - Error handling improvements
   - API response standardization
   - Request/response validation

2. **Code Quality**
   - TypeScript migration for type safety
   - Code organization and modularization
   - Error boundary implementation
   - Loading states and skeletons
   - Proper error messages

3. **State Management**
   - Implement global state management (Redux, Zustand, or Context API)
   - User session management
   - Caching strategies

4. **Performance**
   - Image optimization
   - Code splitting
   - Lazy loading
   - API response caching
   - Offline support

5. **Documentation**
   - API documentation
   - Code comments
   - User guides
   - Developer documentation

---

## Project Status

**Current Phase:** Development - Core Features Implementation
- ✅ Basic UI/UX structure
- ✅ Navigation system
- ✅ Authentication UI (frontend)
- ✅ Role-based flows
- ⚠️ Backend integration (partial)
- ❌ Real-time features
- ❌ Payment integration
- ❌ Advanced optimization

**Next Milestones:**
1. Complete authentication backend integration
2. Implement real-time tracking
3. Add payment gateway
4. Enhance route optimization
5. Deploy to production

---

## Notes

- The backend API is referenced but appears to be in a separate repository
- Current implementation uses placeholder/mock data for some features
- API base URL is configured in `app/config/api.js` (currently: `http://192.168.1.58:8000`)
- The application uses Expo Router for file-based routing
- Some features like map integration exist as files but may need implementation

---

*Last Updated: December 2024*
*Version: 1.0.0*


