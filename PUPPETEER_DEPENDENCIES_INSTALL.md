# Puppeteer Dependencies Installation Guide

## Problem
Puppeteer requires system libraries to run Chrome/Chromium. The error shows:
```
libatk-1.0.so.0: cannot open shared object file: No such file or directory
```

## Solution: Install Dependencies on Server

### Step 1: SSH into your server
```bash
ssh root@your-server-ip
# or
ssh your-username@your-server-ip
```

### Step 2: Install dependencies
```bash
sudo apt-get update

sudo apt-get install -y \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libxss1 \
  libgbm1 \
  libasound2 \
  libxkbcommon0 \
  libxshmfence1
```

### Step 3: Restart PM2
```bash
pm2 restart jssa-backend
pm2 logs jssa-backend --lines 50
```

### Step 4: Test
Submit a form and check logs to verify PDF generation works.

## Alternative: If you can't install dependencies

If you cannot install system dependencies, we can:
1. Use a different PDF generation library (like `pdfkit` or `jspdf`)
2. Generate PDFs on the client side and send to server
3. Use a cloud service for PDF generation

Let me know if you need an alternative approach.
