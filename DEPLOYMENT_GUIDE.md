# 🚀 Deployment Guide - Vakeel Platform

## 📋 Overview

This guide provides step-by-step instructions for deploying the Vakeel platform to production across all platforms.

## 🏗️ **PHASE 1: BACKEND DEPLOYMENT**

### Prerequisites
- **Cloud provider account** (Heroku, AWS, Google Cloud)
- **MongoDB Atlas** account for database
- **Environment variables** configured
- **SSL certificates** ready

### Heroku Deployment (Recommended)

#### 1. Prepare Backend
```bash
cd backend-master

# Create Procfile
echo "web: npm start" > Procfile

# Update package.json scripts
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

#### 2. Deploy to Heroku
```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create vakeel-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set EMAIL_USER=your_email
heroku config:set EMAIL_PASS=your_email_password

# Deploy
git add .
git commit -m "Deploy backend to production"
git push heroku main
```

#### 3. Verify Deployment
```bash
# Check app status
heroku ps

# View logs
heroku logs --tail

# Test API
curl https://vakeel-backend.herokuapp.com/api/health
```

### AWS Deployment (Alternative)

#### 1. EC2 Setup
```bash
# Launch EC2 instance
# Install Node.js and PM2
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone repository
git clone https://github.com/your-repo/vakeel-backend.git
cd vakeel-backend

# Install dependencies
npm install

# Set environment variables
export NODE_ENV=production
export MONGODB_URI=your_mongodb_atlas_uri
export JWT_SECRET=your_jwt_secret

# Start with PM2
pm2 start server.js --name "vakeel-backend"
pm2 save
pm2 startup
```

#### 2. Configure Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8043;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🌐 **PHASE 2: WEB APP DEPLOYMENT**

### Netlify Deployment (Recommended)

#### 1. Prepare Web App
```bash
cd vakeel-web

# Update environment variables
# Create .env.production
REACT_APP_API_URL=https://vakeel-backend.herokuapp.com/api
REACT_APP_SOCKET_URL=https://vakeel-backend.herokuapp.com
```

#### 2. Build for Production
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test build locally
npx serve -s build
```

#### 3. Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=build
```

### Vercel Deployment (Alternative)

#### 1. Prepare for Vercel
```bash
# Create vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/favicon.ico",
      "dest": "/favicon.ico"
    },
    {
      "src": "/manifest.json",
      "dest": "/manifest.json"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🤖 **PHASE 3: ANDROID APP DEPLOYMENT**

### Google Play Store Deployment

#### 1. Prepare Android App
```bash
cd mobile-app-main

# Update app version
# android/app/build.gradle
android {
    defaultConfig {
        versionCode 1
        versionName "1.0.0"
    }
}
```

#### 2. Generate Release APK
```bash
# Generate keystore
keytool -genkey -v -keystore vakeel-release-key.keystore -alias vakeel-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Configure signing
# android/app/build.gradle
android {
    signingConfigs {
        release {
            storeFile file('vakeel-release-key.keystore')
            storePassword 'your_store_password'
            keyAlias 'vakeel-key-alias'
            keyPassword 'your_key_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 3. Build Release APK
```bash
# Clean project
cd android && ./gradlew clean && cd ..

# Build release APK
cd android && ./gradlew assembleRelease && cd ..

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

#### 4. Upload to Google Play Console
1. **Create Google Play Console account**
2. **Create new app**
3. **Upload APK** to internal testing
4. **Configure app metadata**
5. **Submit for review**

### Firebase App Distribution (Testing)

#### 1. Configure Firebase
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init

# Configure app distribution
firebase appdistribution:groups:add testers your-email@domain.com
```

#### 2. Distribute Test Build
```bash
# Build debug APK
cd android && ./gradlew assembleDebug && cd ..

# Upload to Firebase
firebase appdistribution:distribute android/app/build/outputs/apk/debug/app-debug.apk \
  --app your-firebase-app-id \
  --groups testers \
  --release-notes "Test build for Vakeel app"
```

## 🍎 **PHASE 4: iOS APP DEPLOYMENT**

### App Store Deployment

#### 1. Prepare iOS App
```bash
cd vakeel-ios/VakeelIOS

# Update app version
# ios/VakeelIOS/Info.plist
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

#### 2. Configure Code Signing
1. **Open Xcode**
2. **Select project** → Signing & Capabilities
3. **Configure Team** and Bundle Identifier
4. **Generate certificates** and provisioning profiles

#### 3. Build for App Store
```bash
# Install dependencies
cd ios && pod install && cd ..

# Archive app
xcodebuild -workspace ios/VakeelIOS.xcworkspace \
  -scheme VakeelIOS \
  -configuration Release \
  -destination generic/platform=iOS \
  -archivePath VakeelIOS.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath VakeelIOS.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist exportOptions.plist
```

#### 4. Upload to App Store Connect
1. **Create App Store Connect account**
2. **Create new app**
3. **Upload IPA** using Application Loader
4. **Configure app metadata**
5. **Submit for review**

### TestFlight Distribution (Testing)

#### 1. Configure TestFlight
1. **Upload build** to App Store Connect
2. **Configure test information**
3. **Add testers** by email
4. **Submit for beta review**

#### 2. Distribute to Testers
```bash
# Testers receive email invitation
# Download TestFlight app
# Install Vakeel app for testing
```

## 🔧 **PHASE 5: ENVIRONMENT CONFIGURATION**

### Production Environment Variables

#### Backend (.env)
```bash
NODE_ENV=production
PORT=8043
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vakeel
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
FIREBASE_SERVER_KEY=your_firebase_server_key
```

#### Web App (.env.production)
```bash
REACT_APP_API_URL=https://vakeel-backend.herokuapp.com/api
REACT_APP_SOCKET_URL=https://vakeel-backend.herokuapp.com
REACT_APP_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"..."}
```

#### Mobile Apps
```javascript
// src/environment/index.js
const ENV = {
  production: {
    API_BASE_URL: 'https://vakeel-backend.herokuapp.com/api',
    SOCKET_URL: 'https://vakeel-backend.herokuapp.com',
    FIREBASE_CONFIG: {
      // Production Firebase configuration
    }
  }
};
```

### SSL Configuration

#### Backend SSL
```javascript
// server.js
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(options, app).listen(443);
```

#### Web App SSL
- **Netlify**: Automatic SSL
- **Vercel**: Automatic SSL
- **Custom domain**: Configure SSL certificate

## 📊 **PHASE 6: MONITORING & ANALYTICS**

### Backend Monitoring

#### Heroku Monitoring
```bash
# View app metrics
heroku addons:open papertrail
heroku addons:open newrelic

# Monitor logs
heroku logs --tail
```

#### AWS Monitoring
```bash
# Install CloudWatch agent
sudo yum install -y amazon-cloudwatch-agent

# Configure monitoring
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

### Web App Analytics

#### Google Analytics
```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Mobile App Analytics

#### Firebase Analytics
```javascript
// Add to mobile apps
import analytics from '@react-native-firebase/analytics';

// Track events
analytics().logEvent('user_login', {
  user_type: 'client'
});
```

## 🔒 **PHASE 7: SECURITY CONFIGURATION**

### Backend Security

#### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### CORS Configuration
```javascript
app.use(cors({
  origin: [
    'https://vakeel-web.netlify.app',
    'https://vakeel-web.vercel.app',
    'capacitor://localhost',
    'ionic://localhost'
  ],
  credentials: true
}));
```

### Web App Security

#### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline';">
```

#### HTTPS Enforcement
```javascript
// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

## 📈 **PHASE 8: PERFORMANCE OPTIMIZATION**

### Backend Optimization

#### Database Optimization
```javascript
// MongoDB indexes
db.users.createIndex({ "email": 1 });
db.matters.createIndex({ "client_id": 1 });
db.chat_messages.createIndex({ "room_id": 1, "created_at": -1 });
```

#### Caching Strategy
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache frequently accessed data
app.get('/api/matters', async (req, res) => {
  const cacheKey = `matters:${req.query.category}`;
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const matters = await Matter.find(req.query);
  await client.setex(cacheKey, 3600, JSON.stringify(matters));
  res.json(matters);
});
```

### Web App Optimization

#### Bundle Optimization
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

#### Image Optimization
```javascript
// Use WebP images
// Implement lazy loading
// Compress images for mobile
```

## 🚀 **PHASE 9: DEPLOYMENT CHECKLIST**

### Pre-Deployment Checklist
- [ ] **All tests passing**
- [ ] **Environment variables** configured
- [ ] **SSL certificates** installed
- [ ] **Database** backed up
- [ ] **Monitoring** configured
- [ ] **Error tracking** set up

### Post-Deployment Checklist
- [ ] **Health checks** passing
- [ ] **API endpoints** responding
- [ ] **Real-time features** working
- [ ] **Push notifications** configured
- [ ] **Analytics** tracking
- [ ] **Performance** acceptable

### Rollback Plan
```bash
# Heroku rollback
heroku rollback v1

# AWS rollback
# Deploy previous version
# Update DNS if needed

# Mobile app rollback
# Upload previous APK/IPA
# Update app store listing
```

## 📞 **PHASE 10: MAINTENANCE & UPDATES**

### Regular Maintenance
- **Weekly**: Monitor performance metrics
- **Monthly**: Security updates and patches
- **Quarterly**: Feature updates and improvements
- **Annually**: Major version updates

### Update Process
1. **Development**: Test changes locally
2. **Staging**: Deploy to staging environment
3. **Testing**: Comprehensive testing
4. **Production**: Deploy to production
5. **Monitoring**: Monitor for issues

---

## 🎉 **DEPLOYMENT SUCCESS**

### All Platforms Deployed
- ✅ **Backend**: Running on cloud infrastructure
- ✅ **Web App**: Deployed to web hosting
- ✅ **Android App**: Published to Google Play Store
- ✅ **iOS App**: Published to App Store

### Cross-Platform Integration
- ✅ **Unified backend** serving all platforms
- ✅ **Real-time sync** across platforms
- ✅ **Consistent user experience**
- ✅ **Production-ready** architecture

**The Vakeel platform is now live and ready for users!** 🚀 