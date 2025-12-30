# OptiRide

A production-ready Expo Router application for ride-sharing and grocery delivery, built with Supabase and React Native Maps.

## Features

- **Three User Roles**: Passenger, Grocery Customer, Driver
- **Supabase Backend**: Authentication and PostgreSQL database
- **Maps Integration**: React Native Maps for visualization
- **Local Route Optimization**: Haversine distance calculation and greedy routing
- **Real-time Updates**: Zustand state management

## Tech Stack

- React Native with Expo
- Expo Router (file-based routing)
- TypeScript
- Supabase (Auth + Postgres)
- Zustand (state management)
- react-native-maps

## Setup

### 1. Prerequisites

- Node.js (v18+)
- Expo CLI: `npm install -g expo-cli`
- Supabase account and project

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

1. Create a `.env` file in the root directory (copy from `.env.example`)
2. Get your Supabase credentials from [Supabase Dashboard](https://app.supabase.com/project/_/settings/api):
   - Project URL
   - Anon (public) key

3. Update `.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Alternatively, you can set these in `app.json` under `expo.extra`:
```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "your_project_url",
      "supabaseAnonKey": "your_anon_key"
    }
  }
}
```

### 4. Database Setup

Create the following tables in your Supabase PostgreSQL database:

- `users` (id UUID PK, name TEXT, phone TEXT, role TEXT)
- `drivers` (id UUID PK, name TEXT, is_available BOOLEAN, lat NUMERIC, lng NUMERIC)
- `rides` (id UUID PK, user_id UUID, pickup_lat NUMERIC, pickup_lng NUMERIC, drop_lat NUMERIC, drop_lng NUMERIC, status TEXT, driver_id UUID)
- `orders` (id UUID PK, user_id UUID, items JSONB, address TEXT, lat NUMERIC, lng NUMERIC, status TEXT, driver_id UUID)
- `tasks` (id UUID PK, driver_id UUID, type TEXT, ref_id UUID, status TEXT, sequence INTEGER)

See `lib/policies.md` for Row Level Security (RLS) policies.

### 5. Run the App

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## Project Structure

```
app/
├── index.tsx              # Login screen
├── signup.tsx             # Signup screen
├── home.tsx               # Role selection
├── passenger/             # Passenger flow
├── grocery/               # Grocery customer flow
└── driver/                # Driver flow

lib/
├── supabase.ts            # Supabase client configuration
└── policies.md            # Database RLS policies

services/                  # Business logic services
store/                     # Zustand state management
utils/                     # Utility functions (distance, time, uuid)
```

## Key Features

### Authentication
- Email/password authentication via Supabase Auth
- Role-based access (passenger, grocery, driver)
- Session persistence

### Passenger Flow
- Map-based pickup/drop selection
- Local distance calculation (Haversine)
- Nearest driver assignment
- Route visualization

### Grocery Flow
- Product catalog
- Cart management
- Delivery address selection with map pin
- Order placement and driver assignment

### Driver Flow
- Task list view
- Map-based task visualization
- Task status updates (ASSIGNED → IN_PROGRESS → COMPLETED)
- Route optimization for multiple stops

## License

Private project
