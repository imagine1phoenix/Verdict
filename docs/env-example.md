# VERDICT — Environment Variables

Copy to `.env.local` and fill in your values:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-min-32-chars

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Future (Phase 3)
# OPENAI_API_KEY=sk-...
# CLOUDINARY_URL=cloudinary://...
# RESEND_API_KEY=re_...
```

## How to Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## How to Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Application type: **Web application**
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

## How to Get Neon DATABASE_URL

1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project (or create one)
3. Go to **Connection Details**
4. Copy the **Connection string** (pooled recommended for serverless)
