import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User, LoginForm, RegisterForm } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_TOKEN'; payload: string }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'LOGOUT' }
  | { type: 'SET_ERROR'; payload: string };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        dispatch({ type: 'SET_TOKEN', payload: token });
        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials: LoginForm) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // TODO: Implement actual API call
      // const response = await authService.login(credentials);
      
      // Mock response for now
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        fullName: 'John Doe',
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };
      
      const mockToken = 'mock_jwt_token';
      
      await AsyncStorage.setItem('auth_token', mockToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(mockUser));
      
      dispatch({ type: 'SET_USER', payload: mockUser });
      dispatch({ type: 'SET_TOKEN', payload: mockToken });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData: RegisterForm) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // TODO: Implement actual API call
      // const response = await authService.register(userData);
      
      // Mock response for now
      const mockUser: User = {
        id: '1',
        email: userData.email,
        fullName: userData.fullName,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };
      
      const mockToken = 'mock_jwt_token';
      
      await AsyncStorage.setItem('auth_token', mockToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(mockUser));
      
      dispatch({ type: 'SET_USER', payload: mockUser });
      dispatch({ type: 'SET_TOKEN', payload: mockToken });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
    AsyncStorage.setItem('user_data', JSON.stringify(user));
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
