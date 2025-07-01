import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
  
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const storedDocs = await AsyncStorage.getItem('uploadedDocs');
        if (storedDocs) {
          setDocuments(JSON.parse(storedDocs));
        }
      } catch (error) {
        console.error('Failed to load docs:', error);
      }
    };
  
    // Initial load
    loadDocuments();
  
    // Subscribe to event
    const subscription = DeviceEventEmitter.addListener('documentsUpdated', loadDocuments);
  
    // Cleanup
    return () => subscription.remove();
  }, []);

  const removeDocument = async (id: string) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const filteredDocs = documents.filter(doc => doc.id !== id);
            setDocuments(filteredDocs);
            try {
              await AsyncStorage.setItem('uploadedDocs', JSON.stringify(filteredDocs));
            } catch (error) {
              console.error('Failed to save docs after deletion:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Documents ({documents.length})</Text>
      {documents.length === 0 ? (
        <Text style={styles.noDocs}>No saved documents.</Text>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.docItem}>
              <Text style={styles.docName}>{item.name}</Text>
              <TouchableOpacity
                onPress={() => removeDocument(item.id)}
                style={styles.deleteButton}
                activeOpacity={0.6}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  noDocs: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
  },
  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  docName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 6,
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#ff4444',
  },
});
