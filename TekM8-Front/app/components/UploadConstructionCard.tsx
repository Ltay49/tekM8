import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Modal, Image,
  Alert, Pressable, StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

type Document = {
  id: string;
  name: string;
  uri: string;
};

export default function UploadConstructionCard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [namingModalVisible, setNamingModalVisible] = useState(false);
  const [tempImageUri, setTempImageUri] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string>('');

  const extractCardDetails = async (imageUri: string) => {
    try {
      const formData = new FormData();
      formData.append('cardImage', {
        uri: imageUri,
        name: 'cscs-card.jpg',
        type: 'image/jpeg',
      } as any);
  
      const response = await fetch('http://192.168.0.37:3000/vision/extract', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data', // OK for fetch + FormData
        },
      });
  
      const data = await response.json();
      console.log('🧠 Extracted CSCS Card Details:', data);
    } catch (error) {
      console.error('❌ Failed to extract card details:', error);
    }
  };
  

  const requestPermissions = async () => {
    const camera = await ImagePicker.requestCameraPermissionsAsync();
    const media = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return camera.status === 'granted' && media.status === 'granted';
  };

  const handleImagePick = async (source: 'camera' | 'library') => {
    const granted = await requestPermissions();
    if (!granted) return Alert.alert('Permission required');

    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setTempImageUri(uri);
      setNamingModalVisible(true);
    }
  };

  const handleSaveName = async () => {
    if (!tempImageUri || !selectedName) return;

    const newDoc: Document = {
      id: Date.now().toString(),
      name: selectedName,
      uri: tempImageUri,
    };

    setDocuments(prev => [...prev, newDoc]);
    await extractCardDetails(tempImageUri);

    setTempImageUri(null);
    setSelectedName('');
    setNamingModalVisible(false);
  };

  const handleRemove = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => handleImagePick('camera')}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleImagePick('library')}>
          <Text style={styles.buttonText}>Pick from Library</Text>
        </TouchableOpacity>
      </View>

      {documents.length === 0 ? (
        <Text style={styles.noDocsText}>No construction cards captured yet.</Text>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.docItem}>
              <View style={styles.docNameRow}>
                <Text style={styles.docName}>{item.name}</Text>
                <TouchableOpacity onPress={() => handleRemove(item.id)}>
                  <Feather name="trash-2" size={20} color="red" />
                </TouchableOpacity>
              </View>
              <View style={styles.docDetailsRow}>
                <Image source={{ uri: item.uri }} style={styles.thumbnail} />
                <TouchableOpacity style={styles.reviewBtn} onPress={() => setPreviewUri(item.uri)}>
                  <Text style={styles.reviewBtnText}>Preview</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Preview Full Image */}
      <Modal visible={!!previewUri} transparent>
        <Pressable style={styles.modalBackground} onPress={() => setPreviewUri(null)}>
          <Image source={{ uri: previewUri! }} style={styles.fullscreenImage} resizeMode="contain" />
        </Pressable>
      </Modal>

      {/* Naming Modal */}
      <Modal visible={namingModalVisible} transparent animationType="fade">
        <View style={styles.namingModalBackground}>
          <View style={styles.namingModalContainer}>
            <Text style={styles.namingModalTitle}>Name the Card</Text>
            <TouchableOpacity
              style={styles.namingOptionButton}
              onPress={() => setSelectedName('Construction Induction Card')}
            >
              <Text style={styles.namingOptionText}>Construction Induction Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.namingOptionButton}
              onPress={() => setSelectedName('Safety Compliance Sheet')}
            >
              <Text style={styles.namingOptionText}>Safety Compliance Sheet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { marginTop: 15 }]}
              onPress={handleSaveName}
              disabled={!selectedName}
            >
              <Text style={styles.saveButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  noDocsText: { textAlign: 'center', marginTop: 40, color: '#777', fontSize: 16 },

  docItem: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#f2f9ff',
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  docNameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  docName: { fontSize: 17, fontWeight: '600' },
  docDetailsRow: { flexDirection: 'row', alignItems: 'center' },
  thumbnail: { width: 90, height: 60, borderRadius: 8, marginRight: 12, backgroundColor: '#ccc' },
  reviewBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  reviewBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: { width: '95%', height: '85%', borderRadius: 12 },

  namingModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  namingModalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: 300,
    alignItems: 'center',
  },
  namingModalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  namingOptionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 12,
    width: '100%',
  },
  namingOptionText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  saveButton: {
    backgroundColor: '#28A745',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
