import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NoteTaker() {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [savedNotesModalVisible, setSavedNotesModalVisible] = useState(false);
  const [savedContent, setSavedContent] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const summarizeNote = async () => {
    if (!capturedImage) return;

    setLoading(true);
    const fileUri = capturedImage;
    const file = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });

    const formData = new FormData();
    formData.append('image', {
      uri: fileUri,
      name: 'note.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      const response = await fetch('http://192.168.0.37:3000/vision/extract-and-instruct', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await response.json();
      console.log('📥 Parsed JSON response:', data);
      setSummary(data.gptSummary || 'No summary returned.');
    } catch (error) {
      console.error('❌ Summarize failed:', error);
    }

    setLoading(false);
  };

  const confirmAndSave = async () => {
    const timestamp = new Date().toISOString();
    await AsyncStorage.setItem(`note_${timestamp}`, summary);
    alert('Note saved!');
  };

  const openSavedNote = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const noteKeys = keys.filter(k => k.startsWith('note_'));
    if (noteKeys.length === 0) return alert('No saved notes');

    const latestKey = noteKeys.sort().reverse()[0];
    const content = await AsyncStorage.getItem(latestKey);
    setSavedContent(content);
    setSavedNotesModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.newReportButton} onPress={pickImage}>
        <Text style={styles.newReportText}>＋ Take Note Photo</Text>
      </TouchableOpacity>

      {capturedImage && (
        <>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
          <TouchableOpacity style={styles.saveButton} onPress={summarizeNote}>
            <Text style={styles.saveButtonText}>Save & Summarize</Text>
          </TouchableOpacity>
        </>
      )}

      {loading && <ActivityIndicator size="large" color="brown" style={{ marginTop: 20 }} />}

      {summary !== '' && (
        <>
          <ScrollView style={styles.summaryBox}>
            <Text>{summary}</Text>
          </ScrollView>

          <TouchableOpacity style={styles.confirmButton} onPress={confirmAndSave}>
            <Text style={styles.saveButtonText}>✅ Confirm & Save</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={openSavedNote}>
        <Text style={{ marginTop: 20, textAlign: 'center', color: 'blue' }}>📚 Open Last Saved Note</Text>
      </TouchableOpacity>

      <Modal visible={savedNotesModalVisible} transparent={false} animationType="slide">
        <View style={styles.fullscreenContainer}>
          <ScrollView style={styles.summaryBox}>
            <Text>{savedContent}</Text>
          </ScrollView>
          <TouchableOpacity onPress={() => setSavedNotesModalVisible(false)}>
            <Text style={{ textAlign: 'center', marginTop: 20, color: 'red' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  newReportButton: {
    backgroundColor: 'brown',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  newReportText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  preview: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  saveButton: {
    backgroundColor: '#444',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  saveButtonText: { color: '#fff', fontSize: 16 },
  confirmButton: {
    backgroundColor: 'green',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  summaryBox: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    maxHeight: '100%',
  },
  fullscreenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
});
