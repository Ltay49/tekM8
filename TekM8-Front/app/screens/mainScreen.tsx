import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HowToWork from '../components/HowToWork';
import DocumentControl from '../components/DocumentControl';
import Induct from '../components/Induct';
import Configuration from '../components/Configuration';

export default function MainScreen() {
  return (
    <LinearGradient
      colors={['#00AEEF', '#004F7C']}  // from lighter to darker blue
      style={styles.gradient}
    >
      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHow}>
          <HowToWork />
        </View>


        <View style={styles.section}>
          <Configuration />
        </View>

        <View style={styles.section}>
          <DocumentControl />
        </View>

        <View style={styles.section}>
          <Induct />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 24,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  sectionHow:{
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 24,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
});
