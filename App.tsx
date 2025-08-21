import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import Toast from 'react-native-toast-message';

import { theme } from './src/theme';
import { Navigation } from './src/navigation';
import { AuthProvider } from './src/contexts/AuthContext';
import { ResumeProvider } from './src/contexts/ResumeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <ResumeProvider>
            <NavigationContainer>
              <StatusBar
                barStyle="light-content"
                backgroundColor={theme.colors.primary}
              />
              <Navigation />
              <Toast />
            </NavigationContainer>
          </ResumeProvider>
        </AuthProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
};

export default App;
