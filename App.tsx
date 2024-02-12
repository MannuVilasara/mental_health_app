import React from 'react';
import {StyleSheet} from 'react-native';
import {AuthProvider} from './context/authContext';
import RootNavigation from './components/screens/appNavigation/RootNavigation';

function App() {
  return (
    <AuthProvider>
      <RootNavigation/>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({

});

export default App;