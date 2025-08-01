// Environment configuration for Vakeel iOS App
// Same backend connection points as Android app

const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:8043/api',
    SOCKET_URL: 'http://localhost:8043',
    FIREBASE_CONFIG: {
      // Firebase configuration for iOS
      apiKey: "your-ios-api-key",
      authDomain: "vakeel-app.firebaseapp.com",
      projectId: "vakeel-app",
      storageBucket: "vakeel-app.appspot.com",
      messagingSenderId: "123456789",
      appId: "your-ios-app-id"
    }
  },
  production: {
    API_BASE_URL: 'https://vakeel-backend.herokuapp.com/api',
    SOCKET_URL: 'https://vakeel-backend.herokuapp.com',
    FIREBASE_CONFIG: {
      // Production Firebase configuration
      apiKey: "your-production-ios-api-key",
      authDomain: "vakeel-app.firebaseapp.com",
      projectId: "vakeel-app",
      storageBucket: "vakeel-app.appspot.com",
      messagingSenderId: "123456789",
      appId: "your-production-ios-app-id"
    }
  }
};

// Get current environment
const getEnvironment = () => {
  if (__DEV__) {
    return ENV.development;
  }
  return ENV.production;
};

export default getEnvironment(); 