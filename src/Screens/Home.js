import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native'


import Collections from './Collections'



const Home = () => {
    
  return (
    <ScrollView>
        <Image
        source={require("../../assets/hero.jpg")}
        style={styles.image}
      />
      
      <View>
      <Collections/>
      </View>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({})