# Quick Start Guide - Backend Server

## ✅ Backend Server is Running!

The server is accessible at: `http://localhost:3000`

## ⚠️ MongoDB Setup Required

Currently, MongoDB connection string is a placeholder. You need to:

### Option 1: Use MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster**
   - Click "Create" → Choose "Free" tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Username: `jssa_admin` (or your choice)
   - Password: Create a strong password (SAVE IT!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update .env File**
   ```bash
   # In backend/.env, replace:
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jssa?retryWrites=true&w=majority
   
   # With your actual connection string:
   MONGODB_URI=mongodb+srv://jssa_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/jssa?retryWrites=true&w=majority
   ```
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Replace `cluster0.xxxxx` with your actual cluster URL
   - Keep `/jssa` as database name (or change it)

7. **Restart Backend**
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart:
   cd backend
   npm run dev
   ```

### Option 2: Use Local MongoDB (Advanced)

If you have MongoDB installed locally:
```env
MONGODB_URI=mongodb://localhost:27017/jssa
```

## 🚀 Start Backend Server

**From project root:**
```bash
npm run dev:backend
```

**Or from backend folder:**
```bash
cd backend
npm run dev
```

## ✅ Verify Backend is Running

1. **Health Check:**
   ```bash
   curl http://localhost:3000/health
   ```
   Should return: `{"status":"ok","message":"JSSA Backend API is running"}`

2. **Test in Browser:**
   Open: http://localhost:3000/health

## 🔧 Troubleshooting

### "MongoDB connection failed"
- Check your connection string in `.env`
- Verify username/password are correct
- Check IP is whitelisted in MongoDB Atlas
- Ensure cluster is running

### "Port 3000 already in use"
- Another process is using port 3000
- Change PORT in `.env` to another port (e.g., 3001)
- Update frontend `.env` with new port

### "Cannot connect to backend"
- Ensure backend server is running
- Check CORS settings in `server.js`
- Verify `FRONTEND_URL` in backend `.env` matches frontend URL

## 📝 Current Status

- ✅ Backend server code is ready
- ✅ API routes are configured
- ⚠️ MongoDB connection string needs to be updated
- ✅ Frontend is configured to connect to backend

Once MongoDB is connected, you can:
- Register users
- Login
- Create applications
- Manage job postings
