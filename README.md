# ResumeAI React Native App

A complete React Native implementation of the ResumeAI project, featuring smart resume analysis, optimization, and job matching capabilities.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login and registration system
- **Resume Management**: Upload, view, and manage multiple resumes
- **AI-Powered Analysis**: Intelligent resume scoring and optimization suggestions
- **Job Matching**: Find jobs that match your resume skills
- **Template Library**: Professional resume templates for different industries
- **Profile Management**: User account settings and preferences

### Technical Features
- **TypeScript**: Full type safety and better development experience
- **Modern UI**: Material Design 3 with React Native Paper
- **State Management**: Context API with useReducer for efficient state handling
- **Navigation**: React Navigation with stack and tab navigation
- **Responsive Design**: Optimized for both iOS and Android
- **Offline Support**: Local storage and caching capabilities

## 📱 Screens

### Authentication
- **Splash Screen**: App loading and branding
- **Login Screen**: User authentication
- **Register Screen**: New user registration

### Main App
- **Dashboard**: Overview of resumes and quick actions
- **Resume List**: Manage and view all resumes
- **Resume Upload**: Upload new resumes with template selection
- **Resume Detail**: View resume analysis and details
- **Job Matching**: Find matching job opportunities
- **Templates**: Browse and select resume templates
- **Profile**: User settings and account management

## 🛠️ Tech Stack

- **React Native**: 0.72.6
- **TypeScript**: 4.8.4
- **React Navigation**: 6.x
- **React Native Paper**: Material Design components
- **React Query**: Data fetching and caching
- **AsyncStorage**: Local data persistence
- **Document Picker**: File selection
- **Vector Icons**: Icon library

## 📋 Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- JDK 11 or higher

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ResumeAI_ReactNative
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Start Metro bundler**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run the app**
   ```bash
   # Android
   npm run android
   # or
   yarn android
   
   # iOS
   npm run ios
   # or
   yarn ios
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
API_BASE_URL=your_api_url_here
API_KEY=your_api_key_here
```

### Theme Customization
Modify `src/theme/index.ts` to customize colors, typography, and spacing.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── navigation/         # Navigation configuration
├── screens/            # App screens
│   ├── auth/          # Authentication screens
│   ├── dashboard/     # Dashboard screen
│   ├── job/           # Job matching screens
│   ├── profile/       # Profile management
│   ├── resume/        # Resume management
│   └── templates/     # Template selection
├── services/           # API and external services
├── store/              # State management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── theme/              # App theming
```

## 🔌 API Integration

The app is designed to work with a backend API. Update the mock data in context files with actual API calls:

```typescript
// Example API service
const authService = {
  login: async (credentials: LoginForm) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },
  // ... other methods
};
```

## 📱 Platform-Specific Code

### Android
- File permissions in `android/app/src/main/AndroidManifest.xml`
- Native modules configuration
- Gradle dependencies

### iOS
- Info.plist configurations
- Native module linking
- Pod dependencies

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📦 Building

### Android
```bash
# Debug build
npm run android

# Release build
npm run build:android
```

### iOS
```bash
# Debug build
npm run ios

# Release build
npm run build:ios
```

## 🚀 Deployment

### Android
1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Configure release notes and metadata

### iOS
1. Archive the project in Xcode
2. Upload to App Store Connect
3. Configure app store metadata

## 🔒 Security Considerations

- API keys stored in environment variables
- Secure storage for sensitive data
- Input validation and sanitization
- HTTPS for all API communications

## 📊 Performance Optimization

- Lazy loading of screens
- Image optimization and caching
- Efficient state management
- Minimal re-renders with React.memo

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npm start -- --reset-cache
   ```

2. **iOS build failures**
   ```bash
   cd ios && pod deintegrate && pod install
   ```

3. **Android build failures**
   ```bash
   cd android && ./gradlew clean
   ```

### Debug Mode
Enable debug mode in development:
```typescript
// In App.tsx
if (__DEV__) {
  console.log('Development mode enabled');
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React Native community
- Material Design team
- Open source contributors

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This is a React Native implementation of the original Kotlin ResumeAI project. All features and functionality have been preserved while adapting to React Native best practices and mobile development patterns.
