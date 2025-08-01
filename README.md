# Vakeel iOS App

A React Native iOS application for the Vakeel legal services platform, providing 100% feature parity with the Android app.

## 🚀 Features

- **Cross-Platform Login**: Same account works on Web, Android, and iOS
- **Client Features**: Post matters, post requests, chat with lawyers, view profiles
- **Lawyer Features**: Respond to matters, manage clients, team management
- **Real-time Chat**: Socket.io integration with read receipts
- **Push Notifications**: Firebase messaging integration
- **Document Management**: Upload and manage legal documents
- **Profile Management**: View detailed lawyer/client profiles

## 📱 iOS-Specific Features

- **Native iOS UI**: Optimized for iOS design patterns
- **iOS Permissions**: Camera, photo library, location, microphone
- **iOS Notifications**: Native push notification handling
- **iOS Security**: Keychain integration for secure storage
- **iOS Performance**: Optimized for iOS devices

## 🛠 Setup Instructions

### Prerequisites

- macOS with Xcode 14+ installed
- Node.js 16+ and npm
- React Native CLI
- CocoaPods

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd vakeel-ios/VakeelIOS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd ios && pod install && cd ..
   ```

3. **Environment Setup:**
   - Copy `src/environment/index.js` and update with your Firebase configuration
   - Update API endpoints in environment file if needed

4. **iOS Configuration:**
   - Open `ios/VakeelIOS.xcworkspace` in Xcode
   - Update bundle identifier if needed
   - Configure signing and capabilities

### Running the App

1. **Start Metro bundler:**
   ```bash
   npm start
   ```

2. **Run on iOS Simulator:**
   ```bash
   npm run ios
   ```

3. **Run on Physical Device:**
   - Connect your iOS device
   - Open Xcode and select your device
   - Build and run from Xcode

## 🔧 Configuration

### Backend Integration

The iOS app uses the same backend as Android and Web:
- **Development**: `http://localhost:8043/api`
- **Production**: `https://vakeel-backend.herokuapp.com/api`

### Firebase Setup

1. Create a Firebase project
2. Add iOS app to Firebase project
3. Download `GoogleService-Info.plist`
4. Add to Xcode project
5. Update environment configuration

### Push Notifications

1. Configure APNs in Apple Developer Console
2. Add push notification capability in Xcode
3. Update Firebase configuration
4. Test with development and production certificates

## 📁 Project Structure

```
src/
├── assets/           # Images, fonts, icons
├── Components/       # Reusable UI components
├── Navigation/       # Navigation configuration
├── Screens/          # Screen components
│   ├── ClientScreens/    # Client-specific screens
│   ├── LawyerScreens/    # Lawyer-specific screens
│   ├── chat/             # Chat functionality
│   └── auth/             # Authentication screens
├── Services/         # API calls and services
├── Utils/            # Utility functions
└── environment/      # Environment configuration
```

## 🔐 Authentication Flow

1. **User Type Selection**: Client or Lawyer
2. **Login/Register**: Email/password authentication
3. **OTP Verification**: SMS-based verification
4. **Profile Setup**: Complete profile information
5. **Dashboard Access**: Role-based dashboard

## 💬 Chat Features

- **Real-time Messaging**: Socket.io integration
- **Read Receipts**: Message status tracking
- **Profile Viewing**: Click names to view profiles
- **File Sharing**: Document and image sharing
- **Push Notifications**: Message notifications

## 📋 Matter Management

### Client Features
- Post new matters with categories
- Track matter progress
- View lawyer responses
- Accept lawyer proposals
- Chat with interested lawyers

### Lawyer Features
- Browse client matters
- Respond to matters
- Send proposals
- Track client interactions
- Manage team members

## 🎨 UI/UX

- **iOS Design Patterns**: Follows iOS Human Interface Guidelines
- **Dark/Light Mode**: System-based theme switching
- **Accessibility**: VoiceOver and accessibility support
- **Responsive Design**: Optimized for all iOS devices
- **Smooth Animations**: Native iOS animations

## 🧪 Testing

```bash
# Run tests
npm test

# Run iOS tests
npm run test:ios

# Run linting
npm run lint
```

## 📦 Building for Production

1. **Configure signing in Xcode**
2. **Update version and build numbers**
3. **Build archive:**
   ```bash
   cd ios
   xcodebuild -workspace VakeelIOS.xcworkspace -scheme VakeelIOS -configuration Release archive -archivePath VakeelIOS.xcarchive
   ```
4. **Upload to App Store Connect**

## 🔄 Cross-Platform Sync

The iOS app maintains perfect sync with:
- **Web App**: Same backend, same data
- **Android App**: Identical features and flow
- **Backend API**: Unified data management

## 🐛 Troubleshooting

### Common Issues

1. **Pod install fails:**
   ```bash
   cd ios && pod deintegrate && pod install
   ```

2. **Metro bundler issues:**
   ```bash
   npm start -- --reset-cache
   ```

3. **Build errors:**
   - Clean build folder in Xcode
   - Delete derived data
   - Reinstall pods

4. **Permission issues:**
   - Check Info.plist permissions
   - Verify iOS capabilities in Xcode

## 📞 Support

For technical support or feature requests, please contact the development team.

## 📄 License

This project is proprietary software. All rights reserved. 