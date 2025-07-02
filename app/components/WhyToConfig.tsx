import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function WhyToConfig() {


  const [whyExpanded, setWhyExpanded] = useState(false);

  const toggleWhy = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setWhyExpanded(!whyExpanded);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.container}>
          {/* Collapsible Why Section */}
          <TouchableOpacity onPress={toggleWhy} style={styles.sectionHeader}>
            <Text style={styles.heading}>Why?</Text>
            <AntDesign name={whyExpanded ? 'up' : 'down'} size={20} color="#007AFF" />
          </TouchableOpacity>
          {whyExpanded && (
            <View style={styles.whyContent}>
              <Text style={styles.description}>
                This will auto-sign your sheets with your project details to help automate and speed up your induction process.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom:10,
  },
  container: {
    padding: 20,
    backgroundColor: '#F4F7FA',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    marginBottom:0,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  heading: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  whyContent: {
    marginBottom: 5,
  },
  description: {
    marginTop:10,
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#333',
    lineHeight: 22,
  },
  section: {
    marginTop: 8,
  },
});
