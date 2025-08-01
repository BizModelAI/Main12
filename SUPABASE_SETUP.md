# Supabase Setup Guide

## Quick Setup

1. **Test the connection first:**
   ```bash
   node test-connection.js
   ```

2. **If connection works, run the setup:**
   ```bash
   node setup-supabase.js
   ```

3. **If setup fails, manually update your .env file:**
   ```
   DATABASE_URL=postgresql://postgres:aX6P%23%40%40DXizpBJa@db.sxykykqlikvzaeugbavt.supabase.co:5432/postgres
   DIRECT_URL=postgresql://postgres:aX6P%23%40%40DXizpBJa@db.sxykykqlikvzaeugbavt.supabase.co:5432/postgres
   ```

4. **Then run:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Connection Strings Explained

- **Direct Connection**: `postgresql://postgres:[password]@db.sxykykqlikvzaeugbavt.supabase.co:5432/postgres`
  - Used for migrations and schema changes
  - Port 5432

- **Pooler Connection**: `postgresql://postgres.sxykykqlikvzaeugbavt:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
  - Used for regular app operations
  - Port 6543
  - Better performance for multiple connections

## Troubleshooting

1. **Connection fails**: Check if your Supabase database is active
2. **IP restrictions**: Make sure your IP is allowed in Supabase settings
3. **Password encoding**: Special characters in password must be URL-encoded
   - `#` → `%23`
   - `@` → `%40`

## What's Been Updated

✅ Prisma schema configured for Supabase
✅ Database connection file updated
✅ Connection test scripts created
✅ Setup automation script created

Your app is now ready for Supabase! 