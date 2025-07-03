import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

type Document = {
  id: string;
  name: string;
  uri: string;
  size?: number;
  mimeType?: string;
  lastModified?: number;
};

export default function UploadConstructionCard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [reviewImageUri, setReviewImageUri] = useState<string | null>(null);
  const [namingModalVisible, setNamingModalVisible] = useState(false);
  const [pendingDocs, setPendingDocs] = useState<Document[]>([]);
  const [currentPendingIndex, setCurrentPendingIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus.status !== 'granted' || mediaStatus.status !== 'granted') {
      Alert.alert('Permissions required', 'Camera and media library permissions are required to proceed.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0];
      const newDoc: Document = {
        id: Date.now().toString() + Math.random(),
        name: '',
        uri: file.uri,
        size: undefined,
        mimeType: 'image/jpeg',
        lastModified: undefined,
      };

      setPendingDocs([newDoc]);
      setCurrentPendingIndex(0);
      setNamingModalVisible(true);
      setIsEditing(false);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0];
      const newDoc: Document = {
        id: Date.now().toString() + Math.random(),
        name: '',
        uri: file.uri,
        size: undefined,
        mimeType: 'image/jpeg',
        lastModified: undefined,
      };

      setPendingDocs([newDoc]);
      setCurrentPendingIndex(0);
      setNamingModalVisible(true);
      setIsEditing(false);
    }
  };

  const saveDocuments = async () => {
    try {
      const storedDocsString = await AsyncStorage.getItem('constructionCards');
      const storedDocs: Document[] = storedDocsString ? JSON.parse(storedDocsString) : [];

      const totalDocs = storedDocs.length + documents.length;
      if (totalDocs > 5) {
        Alert.alert('Limit reached', 'Maximum of 5 construction cards allowed in storage.');
        return;
      }

      const updatedDocs = [...storedDocs, ...documents];
      await AsyncStorage.setItem('constructionCards', JSON.stringify(updatedDocs));
      Alert.alert('Success', 'Construction cards saved.');
      setDocuments([]);
    } catch (error) {
      Alert.alert('Error saving construction cards', (error as Error).message);
    }
  };

  const onNameSelected = (selectedName: string) => {
    if (isEditing && editingDocId) {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === editingDocId ? { ...doc, name: selectedName } : doc))
      );
      setIsEditing(false);
      setEditingDocId(null);
      setNamingModalVisible(false);
    } else {
      setPendingDocs((prev) => {
        const updated = [...prev];
        updated[currentPendingIndex].name = selectedName;
        return updated;
      });

      if (currentPendingIndex + 1 < pendingDocs.length) {
        setCurrentPendingIndex(currentPendingIndex + 1);
      } else {
        setDocuments((prev) => [...prev, ...pendingDocs]);
        setPendingDocs([]);
        setCurrentPendingIndex(0);
        setNamingModalVisible(false);
      }
    }
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const editDocumentName = (id: string) => {
    setEditingDocId(id);
    setIsEditing(true);
    setNamingModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <TouchableOpacity style={styles.button} onPress={takePhoto} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickImage} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Pick from Library</Text>
        </TouchableOpacity>
      </View>

      {documents.length === 0 ? (
        <Text style={styles.noDocsText}>No construction cards captured this session.</Text>
      ) : (
        <>
          <FlatList
            data={documents}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={styles.docItem}>
                <View style={styles.docNameRow}>
                  <Text style={styles.docName} numberOfLines={1} ellipsizeMode="tail">
                    {item.name || 'Unnamed Card'}
                  </Text>
                  <TouchableOpacity onPress={() => editDocumentName(item.id)} style={styles.editIcon} activeOpacity={0.7}>
                    <Feather name="edit-2" size={22} color="#2C7BE5" />
                  </TouchableOpacity>
                </View>

                <View style={styles.docDetailsRow}>
                  <Image source={{ uri: item.uri }} style={styles.thumbnail} resizeMode="cover" />

                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      style={styles.reviewBtn}
                      onPress={() => setReviewImageUri(item.uri)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.reviewBtnText}>Review</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeDocument(item.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.removeBtnText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          <TouchableOpacity style={styles.saveButton} onPress={saveDocuments} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>Save Cards</Text>
          </TouchableOpacity>

          <Modal
            visible={reviewImageUri !== null}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setReviewImageUri(null)}
          >
            <Pressable style={styles.modalBackground} onPress={() => setReviewImageUri(null)}>
              <Image source={{ uri: reviewImageUri! }} style={styles.fullscreenImage} resizeMode="contain" />
            </Pressable>
          </Modal>
        </>
      )}

      <Modal
        visible={namingModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNamingModalVisible(false)}
      >
        <View style={styles.namingModalBackground}>
          <View style={styles.namingModalContainer}>
            <Text style={styles.namingModalTitle}>Name the Card</Text>
            {!isEditing && (
              <Text style={styles.namingModalFileName}>
                {pendingDocs[currentPendingIndex]?.uri.split('/').pop()}
              </Text>
            )}
            {isEditing && (
              <Text style={styles.namingModalFileName}>
                Editing: {documents.find((doc) => doc.id === editingDocId)?.name || 'Card'}
              </Text>
            )}

            <TouchableOpacity
              style={styles.namingOptionButton}
              onPress={() => onNameSelected('Construction Induction Card')}
              activeOpacity={0.8}
            >
              <Text style={styles.namingOptionText}>Construction Induction Card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.namingOptionButton}
              onPress={() => onNameSelected('Safety Compliance Sheet')}
              activeOpacity={0.8}
            >
              <Text style={styles.namingOptionText}>Safety Compliance Sheet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  button: {
    backgroundColor: '#2C7BE5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },

  noDocsText: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginTop: 40, color: '#555' },

  list: { marginBottom: 20 },
  docItem: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#f2f9ff',
    padding: 15,
    shadowColor: '#2C7BE5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  docNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  docName: { fontSize: 20, fontWeight: '600', flex: 1, marginRight: 10 },
  editIcon: { padding: 4 },

  docDetailsRow: { flexDirection: 'row', alignItems: 'center' },
  thumbnail: { width: 90, height: 60, borderRadius: 8, marginRight: 10, backgroundColor: '#ccc' },

  buttonsContainer: { flex: 1, justifyContent: 'space-around', flexDirection: 'row' },
  reviewBtn: {
    backgroundColor: '#2C7BE5',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  reviewBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  removeBtn: {
    backgroundColor: '#E45858',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  removeBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  saveButton: {
    backgroundColor: '#2C7BE5',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: { color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center' },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '95%',
    height: '85%',
    borderRadius: 12,
  },

  namingModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  namingModalContainer: {
    backgroundColor: '#fff',
    width: 280,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  namingModalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  namingModalFileName: { fontSize: 16, marginBottom: 15, color: '#333' },

  namingOptionButton: {
    backgroundColor: '#2C7BE5',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 12,
    width: '100%',
  },
  namingOptionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
