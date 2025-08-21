import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ResumeListScreen from '../screens/resume/ResumeListScreen';
import ResumeDetailScreen from '../screens/resume/ResumeDetailScreen';
import ResumeUploadScreen from '../screens/resume/ResumeUploadScreen';
import JobMatchingScreen from '../screens/job/JobMatchingScreen';
import TemplatesScreen from '../screens/templates/TemplatesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Icons
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
              break;
            case 'Resume':
              iconName = focused ? 'file-document' : 'file-document-outline';
              break;
            case 'JobMatching':
              iconName = focused ? 'briefcase' : 'briefcase-outline';
              break;
            case 'Templates':
              iconName = focused ? 'palette' : 'palette-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Resume" 
        component={ResumeStack}
        options={{ title: 'Resumes' }}
      />
      <Tab.Screen 
        name="JobMatching" 
        component={JobMatchingScreen}
        options={{ title: 'Job Match' }}
      />
      <Tab.Screen 
        name="Templates" 
        component={TemplatesScreen}
        options={{ title: 'Templates' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const ResumeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ResumeList" 
        component={ResumeListScreen}
        options={{ title: 'My Resumes' }}
      />
      <Stack.Screen 
        name="ResumeDetail" 
        component={ResumeDetailScreen}
        options={{ title: 'Resume Details' }}
      />
      <Stack.Screen 
        name="ResumeUpload" 
        component={ResumeUploadScreen}
        options={{ title: 'Upload Resume' }}
      />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export const Navigation = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};
