#!/bin/bash

echo "🚀 Setting up Vakeel iOS App..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the VakeelIOS directory."
    exit 1
fi

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Install iOS dependencies
echo "🍎 Installing iOS dependencies..."
cd ios
pod install
cd ..

# Create necessary directories if they don't exist
echo "📁 Creating project structure..."
mkdir -p ios/VakeelIOS/Images.xcassets/AppIcon.appiconset
mkdir -p ios/VakeelIOS/Images.xcassets/Splash.imageset

# Copy assets if they exist
if [ -d "src/assets/Images" ]; then
    echo "🖼️ Copying assets..."
    cp -r src/assets/Images/* ios/VakeelIOS/Images.xcassets/ 2>/dev/null || true
fi

# Set up environment
echo "⚙️ Setting up environment..."
if [ ! -f "src/environment/index.js" ]; then
    echo "⚠️ Warning: Environment file not found. Please create src/environment/index.js"
fi

echo "✅ iOS setup complete!"
echo ""
echo "📱 Next steps:"
echo "1. Open ios/VakeelIOS.xcworkspace in Xcode"
echo "2. Configure your bundle identifier"
echo "3. Set up signing and capabilities"
echo "4. Run 'npm start' to start Metro bundler"
echo "5. Run 'npm run ios' to launch on simulator"
echo ""
echo "🔧 For Firebase setup:"
echo "1. Create a Firebase project"
echo "2. Add iOS app to Firebase"
echo "3. Download GoogleService-Info.plist"
echo "4. Add to Xcode project"
echo "5. Update environment configuration" 