import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ChatNavigator from './src/chat/navigation';
import {ChatProvider} from './src/chat/ChatContext';

function App() {
  return (
    <SafeAreaProvider>
      <ChatProvider>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer>
          <ChatNavigator />
        </NavigationContainer>
      </ChatProvider>
    </SafeAreaProvider>
  );
}

export default App;
