import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Dashboard from '../components/Dashboard';

export default function MainScreen() {
  return (
    <View style={styles.root}>
      {/* <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      > */}
        <Dashboard />
        {/* Add other components here as needed */}
      {/* </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#0B1A2F',  },

  scrollContent: {
    paddingBottom: 100,
    backgroundColor: '#0B1A2F',  },
});

