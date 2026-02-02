-- Run this AFTER the initial migration to add your first admin
-- Replace 'your-admin@email.com' with your actual email address

-- First, the admin needs to sign in with magic link
-- This creates a user in auth.users automatically

-- After signing in, run this to grant admin privileges:
-- (Replace the email with your admin's email)

INSERT INTO admins (id, email, name)
SELECT id, email, 'Admin'
FROM auth.users
WHERE email = 'your-admin@email.com'
ON CONFLICT (id) DO NOTHING;

-- To add additional admins later:
-- INSERT INTO admins (id, email, name)
-- SELECT id, email, 'Admin Name'
-- FROM auth.users
-- WHERE email = 'another-admin@email.com'
-- ON CONFLICT (id) DO NOTHING;

-- To remove an admin:
-- DELETE FROM admins WHERE email = 'admin-to-remove@email.com';

-- To list all admins:
-- SELECT a.email, a.name, a.created_at FROM admins a;
