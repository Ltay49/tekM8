import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const SettingsScreen = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const handleToggle = () => setIsDarkMode(prev => !prev);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Settings</Text>
      </View>

      {/* Project Setup Section */}
      <Text style={styles.sectionLabel}>Project Setup</Text>
      <TouchableOpacity style={styles.card} onPress={() => router.push('./screens/configurationScreen')}>
        <Text style={styles.cardText}>Project Config</Text>
      </TouchableOpacity>

      {/* Documentation Section */}
      <Text style={styles.sectionLabel}>Upload Documentation</Text>
      <TouchableOpacity style={styles.card} onPress={() => router.push('./screens/documentControlScreen')}>
        <Text style={styles.cardText}>Induction Forms</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push('./screens/programScreen')}>
        <Text style={styles.cardText}>Programme</Text>
      </TouchableOpacity>

      {/* Feedback Section */}
      <Text style={styles.sectionLabel}>Feedback</Text>
      <TouchableOpacity style={styles.card} onPress={() => router.push('./screens/configurationScreen')}>
        <Text style={styles.cardText}>Send Email</Text>
      </TouchableOpacity>

      {/* Legal Section */}
      <Text style={styles.sectionLabel}>Legal</Text>
      <TouchableOpacity style={styles.card} onPress={() => router.push('./screens/configurationScreen')}>
        <Text style={styles.cardText}>Privacy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push('./screens/configurationScreen')}>
        <Text style={styles.cardText}>Terms and Conditions</Text>
      </TouchableOpacity>

      {/* Dark Mode Toggle */}
      <View style={styles.cardRow}>
        <Text style={styles.cardText}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={handleToggle}
          thumbColor={isDarkMode ? '#0A84FF' : '#ccc'}
          trackColor={{ false: '#777', true: '#0A84FF' }}
        />
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#0B1A2F',
  },
  headerContainer: {
    backgroundColor: '#D84343',
    borderRadius: 4,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: '800',
    color: 'black',
  },
  sectionLabel: {
    color: '#7FB3D5',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 14,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#1F3B60',
    borderRadius: 5,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ffffff33',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F3B60',
    borderRadius: 5,
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ffffff33',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  cardText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
});
