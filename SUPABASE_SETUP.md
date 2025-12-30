# Supabase Setup Guide

## Getting Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (or create a new one)
3. Navigate to **Settings** → **API**
4. Copy the following:
   - **Project URL** → Use as `EXPO_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use as `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Configuration Options

### Option 1: Environment Variables (Recommended)

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Option 2: app.json Configuration

Update `app.json`:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://your-project.supabase.co",
      "supabaseAnonKey": "your_anon_key_here"
    }
  }
}
```

## Database Schema

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('passenger', 'grocery', 'driver')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drivers table
CREATE TABLE drivers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  lat NUMERIC DEFAULT 0,
  lng NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rides table
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pickup_lat NUMERIC NOT NULL,
  pickup_lng NUMERIC NOT NULL,
  drop_lat NUMERIC NOT NULL,
  drop_lng NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED')),
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  address TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'ASSIGNED', 'IN_PROGRESS', 'DELIVERED')),
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('ride', 'order')),
  ref_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'ASSIGNED' CHECK (status IN ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED')),
  sequence INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies (see lib/policies.md for details)
-- Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Drivers can read/update their own row
CREATE POLICY "Drivers can view own row" ON drivers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Drivers can update own row" ON drivers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Drivers can insert own row" ON drivers FOR INSERT WITH CHECK (auth.uid() = id);

-- Rides policies
CREATE POLICY "Users can insert own rides" ON rides FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own rides" ON rides FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own rides" ON rides FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Drivers can view assigned rides" ON rides FOR SELECT USING (
  EXISTS (SELECT 1 FROM tasks WHERE tasks.driver_id = auth.uid() AND tasks.ref_id = rides.id AND tasks.type = 'ride')
);

-- Orders policies
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Drivers can view assigned orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM tasks WHERE tasks.driver_id = auth.uid() AND tasks.ref_id = orders.id AND tasks.type = 'order')
);

-- Tasks policies
CREATE POLICY "Drivers can view own tasks" ON tasks FOR SELECT USING (auth.uid() = driver_id);
CREATE POLICY "Drivers can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = driver_id);
CREATE POLICY "Authenticated users can insert tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

## Testing

After setup, test the connection by:

1. Starting the app: `npm start`
2. Creating a test account via the signup screen
3. Check Supabase Auth dashboard to verify user creation
4. Check the database tables to verify profile creation

