import React from 'react';
import { StyleSheet } from 'react-native';
import { AuthProvider } from './context/authContext';
import RootNavigation from './components/screens/appNavigation/RootNavigation';
import { TaskProvider } from './context/taskContext';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <RootNavigation />
      </TaskProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({

});

export default App;