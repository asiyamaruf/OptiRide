# Supabase RLS Policies

Enable Row Level Security on `users`, `drivers`, `rides`, `orders`, `tasks`.

## users
- Enable RLS
- Policy: users can read/update their own profile
```
(auth.uid() = id)
```
- Inserts restricted to signup flow only.

## drivers
- Enable RLS
- Policy: drivers read/update only their own row
```
(auth.uid() = id)
```
- Inserts/upserts allowed to authenticated clients so the app can onboard new drivers.

## rides
- Enable RLS
- Users can insert rides where `user_id = auth.uid()`
- Users can select/update rides where `user_id = auth.uid()`
- Drivers can select rides when they have an assigned task:
```
exists(
  select 1 from tasks t
  where t.driver_id = auth.uid()
    and t.ref_id = rides.id
    and t.type = 'ride'
)
```

## orders
- Enable RLS
- Users can insert/select/update orders where `user_id = auth.uid()`
- Drivers can select orders when they have an assigned task:
```
exists(
  select 1 from tasks t
  where t.driver_id = auth.uid()
    and t.ref_id = orders.id
    and t.type = 'order'
)
```

## tasks
- Enable RLS
- Drivers can select/update tasks where `driver_id = auth.uid()`
- Inserts allowed for authenticated users to assign drivers (assignment is client-driven, no public anonymous access).
