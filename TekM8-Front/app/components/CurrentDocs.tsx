import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

type Document = {
  id: string;
  name: string;
  uri: string;
  mimeType?: string;
};

export default function CurrentDocs() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const storedDocs = await AsyncStorage.getItem('uploadedDocs');
        if (storedDocs) {
          const parsed: Document[] = JSON.parse(storedDocs);
          const imagesOnly = parsed.filter(doc => doc.uri.endsWith('.png'));
          setDocuments(imagesOnly);
        }
      } catch (error) {
        console.error('Failed to load docs:', error);
      }
    };

    loadDocuments();
    const subscription = DeviceEventEmitter.addListener('documentsUpdated', loadDocuments);
    return () => subscription.remove();
  }, []);

  const removeDocument = async (id: string) => {
    Alert.alert('Delete Image', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const filtered = documents.filter(doc => doc.id !== id);
          setDocuments(filtered);
          try {
            await AsyncStorage.setItem('uploadedDocs', JSON.stringify(filtered));
          } catch (error) {
            console.error('Failed to save after delete:', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Forms ({documents.length})</Text>
      {documents.length === 0 ? (
        <Text style={styles.noDocs}>No saved PNG images found.</Text>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setPreviewUri(item.uri)} style={styles.docItem}>
            
              <View style={styles.docItemInside}>
                <Image source={{ uri: item.uri }} style={styles.thumbnail} />
                <View style={styles.docDetails}>
                  <Text style={styles.docName}>{item.name}</Text>
                  <Text style={styles.docDate}>Created: {new Date(Number(item.id)).toLocaleDateString()}</Text>
                  <TouchableOpacity onPress={() => removeDocument(item.id)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Fullscreen Preview */}
      <Modal visible={!!previewUri} transparent animationType="fade">
        <Pressable style={styles.modalBackground} onPress={() => setPreviewUri(null)}>
          <Image source={{ uri: previewUri! }} style={styles.fullscreenImage} resizeMode="contain" />
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1F3B60',
    borderRadius: 0,
  },
  title: {
    color:'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    
  },
  noDocs: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    
  },
  docItem: {
    borderColor: '#007AFF', // subtle blue
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 12,
    alignItems: 'center',
  
    // Shadow for iOS
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  
    // Elevation for Android
    elevation: 2,
  },
  
  docItemInside:{
    justifyContent:'center',
    borderWidth:0,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    // marginBottom: 12,
    alignItems: 'center',
  },
  thumbnail: {
    width: 100,
    height: 141, // A4 ratio (100 * 1.414)
    // borderRadius: 6,
    borderWidth:1,
    backgroundColor: '#e0e0e0',
  },
  docDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  docName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  docDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#ffefef',
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#cc0000',
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});
