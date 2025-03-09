import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/authContext';
import { TaskProvider } from './context/taskContext';
import RootNavigation from './components/screens/appNavigation/RootNavigation';

function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <TaskProvider>
          <RootNavigation />
        </TaskProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;