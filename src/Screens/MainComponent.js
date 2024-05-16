import { StyleSheet, Text, View ,StatusBar} from 'react-native'
import React from 'react'
import Home from './Home'

const MainComponent = () => {
  return (
    <View style={styles.container}>
      
    <Home/>
  </View>
  )
}

export default MainComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
      },
})