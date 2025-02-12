import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screen/Home';
// import Home from '../screen/Home';

const Stack = createStackNavigator();
const Router = () => {
  return (
    //   <SafeAreaView><Text>xzfdsfsdf</Text></SafeAreaView>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      {/* <Stack.Screen name="VideoRecording" component={VideoRecording} />
      <Stack.Screen name="ScreenRecording" component={ScreenRecording} /> */}
    </Stack.Navigator>
  );
};

export default Router;
