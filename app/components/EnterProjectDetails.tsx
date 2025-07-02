import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Signature from 'react-native-signature-canvas';
import { Image } from 'react-native';

export default function EnterDetails() {
  const [form, setForm] = useState({
    firstName: '',
    surname: '',
    title: '',
    projectName: '',
    projectCode: '',
    email: '',
    signature: '', // base64 PNG string
  });

  const [sigModalVisible, setSigModalVisible] = useState(false);

  const signatureRef = useRef<any>(null);

  useEffect(() => {
    const checkSaved = async () => {
      const saved = await AsyncStorage.getItem('userDetails');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setForm(parsed);
        } catch (e) {
          console.log('Failed to parse saved form:', e);
        }
      }
    };
    checkSaved();
  }, []);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('userDetails', JSON.stringify(form));
      Alert.alert('Success', 'Details saved!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save details.');
    }
  };

  // Called when user taps "Save" inside signature modal
  const handleSignature = (signature: string) => {
    setForm(prev => ({ ...prev, signature }));
    setSigModalVisible(false);
  };

  // Clear signature canvas (does NOT close modal)
  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  // Cancel signature modal (discard changes)
  const handleCancel = () => {
    setSigModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.container}>
          {/* Your Details Form */}
          <Text style={styles.heading}>Enter Your Details</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={form.firstName}
            onChangeText={text => handleChange('firstName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Surname"
            value={form.surname}
            onChangeText={text => handleChange('surname', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={form.title}
            onChangeText={text => handleChange('title', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Project Name"
            value={form.projectName}
            onChangeText={text => handleChange('projectName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Project Code"
            value={form.projectCode}
            onChangeText={text => handleChange('projectCode', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={form.email}
            onChangeText={text => handleChange('email', text)}
          />

          {/* Signature Section */}
          <TouchableOpacity
            style={styles.signaturePlaceholder}
            onPress={() => setSigModalVisible(true)}
          >
            {form.signature ? (
              <Image
                source={{ uri: form.signature }}
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.signatureText}>Tap to Sign Here</Text>
            )}
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Signature Modal */}
        <Modal visible={sigModalVisible} animationType="slide" transparent={false}>
          <View style={styles.modalContainer}>
            <Signature
              ref={signatureRef}
              onOK={handleSignature}
              descriptionText="Sign above"
              clearText="Clear"
              confirmText="Save"
              webStyle={`
                .m-signature-pad {box-shadow: none; border: none;}
                body,html {width: 100%; height: 100%;}
              `}
            />

            <View style={styles.sigFooter}>
              <TouchableOpacity onPress={handleClear} style={styles.sigButton}>
                <Text style={styles.sigButtonText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  signatureRef.current?.readSignature();
                }}
                style={[styles.sigButton, styles.sigButtonSave]}
              >
                <Text style={[styles.sigButtonText, { color: '#fff' }]}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCancel} style={styles.sigButton}>
                <Text style={styles.sigButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f9fafb',
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  heading: {
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#000',
  },
  signaturePlaceholder: {
    height: 100,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  signatureText: {
    color: '#555',
    fontSize: 16,
    fontFamily: 'Montserrat_500Medium',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
  },
  saveButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  sigFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  sigButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  sigButtonSave: {
    backgroundColor: '#007AFF',
  },
  sigButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#007AFF',
  },
});

