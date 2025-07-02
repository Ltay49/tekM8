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
import WhyToConfig from '../components/WhyToConfig';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function EnterDetails(){
const [form, setForm] = useState({
    firstName: '',
    surname: '',
    title: '',
    projectName: '',
    projectCode: '',
    email: '',
    signature: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('userDetails', JSON.stringify(form));
      Alert.alert('Success', 'Details saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save details.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.container}>
          {/* Your Details Form */}
          <View style={styles.section}>
            <Text style={styles.heading}>Enter Here</Text>

            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={form.firstName}
              onChangeText={(text) => handleChange('name', text)}
            />
               <TextInput
              style={styles.input}
              placeholder="Surname"
              value={form.surname}
              onChangeText={(text) => handleChange('name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={form.title}
              onChangeText={(text) => handleChange('title', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Project Name"
              value={form.projectName}
              onChangeText={(text) => handleChange('projectName', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Project Code"
              value={form.projectCode}
              onChangeText={(text) => handleChange('projectCode', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => handleChange('email', text)}
            />
            <TextInput
              style={[styles.input, styles.signature]}
              placeholder="Signature"
              multiline
              numberOfLines={3}
              value={form.signature}
              onChangeText={(text) => handleChange('signature', text)}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // padding: 16,
    // backgroundColor: '#f9fafb',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    paddingTop:0,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    marginBottom:28,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  heading: {
    marginBottom:5,
    paddingBottom:5,
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    color: '#1A1A1A',
  },
  section: {
    marginTop: 8,
  },
  input: {
    fontFamily: 'Montserrat_400Regular',
    backgroundColor: '#F9FAFB',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    color: '#000',
  },
  signature: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
  },
});
