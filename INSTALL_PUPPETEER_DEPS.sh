#!/bin/bash
# Install Puppeteer dependencies on Linux server
# Run this script on your server with: sudo bash INSTALL_PUPPETEER_DEPS.sh

echo "📦 Installing Puppeteer dependencies..."

# Update package list
sudo apt-get update

# Install required libraries
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

echo "✅ Dependencies installed successfully!"
echo "🔄 Please restart your backend server:"
echo "   pm2 restart jssa-backend"
