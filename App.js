import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './src/Screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainComponent from './src/Screens/MainComponent';
import Product from './src/Screens/Product';

export default function App() {
    const Stack = createNativeStackNavigator();


  return (
<NavigationContainer>
    <Stack.Navigator 
    //  screenOptions={{
    //     headerShown: false,
        
    //   }}
      >
        <Stack.Screen name='Home' component={Home}/>

        <Stack.Screen name='Product' component={Product}/>

    </Stack.Navigator>
</NavigationContainer>
  )
}


