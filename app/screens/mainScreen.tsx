import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import HowToWork from '../components/HowToWork';
import DocumentControl from '../components/DocumentControl';
import Induct from '../components/Induct';

export default function MainScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.section}>
        <HowToWork />
      </View>

      <View style={styles.section}>
        <DocumentControl />
      </View>

      <View style={styles.section}>
        <Induct />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height:'100%',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    // Android shadow
    elevation: 5,
  },
});
