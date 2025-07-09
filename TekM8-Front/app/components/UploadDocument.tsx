// UploadDocument.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import axios from 'axios';
import mime from 'mime';

type Document = {
    id: string;
    name: string;
    uri: string;
};

const STORAGE_KEY = 'uploadedDocs';

export default function UploadDocument() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [previewUri, setPreviewUri] = useState<string | null>(null);
    const [savedDocIds, setSavedDocIds] = useState<Set<string>>(new Set());
    const [previewedDocIds, setPreviewedDocIds] = useState<Set<string>>(new Set());
    const [namingModalVisible, setNamingModalVisible] = useState(false);
    const [tempFileUri, setTempFileUri] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string>('');
    const [editingDocId, setEditingDocId] = useState<string | null>(null);

    const handleUploadAndPreview = async (doc: Document) => {
        try {
            const userDetails = {
                name: 'John Doe',
                position: 'Engineer',
                date: '2025-07-03',
                signature: 'John D',
                projectName: 'New Build',
                projectCode: 'NB123',
                inducteeName: 'John D',
            };

            const checkedItems = [
                'Signed Method Statement',
                'Appropriate PPE',
                'Knows the fire drill',
            ];

            const formData = new FormData();
            formData.append('formImage', {
                uri: doc.uri,
                name: doc.name || 'upload.pdf',
                type: mime.getType(doc.uri) || 'application/pdf',
            } as any);

            formData.append('userDetails', JSON.stringify(userDetails));
            formData.append('checkedItems', JSON.stringify(checkedItems));

            const response = await axios.post(
                'http://192.168.0.37:3000/form/fill',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            const { filledPath } = response.data;
            const filledImageUrl = `http://192.168.0.37:3000/${filledPath.replace(/\\/g, '/')}`;

            const updatedDoc: Document = {
                ...doc,
                uri: filledImageUrl,
            };

            setDocuments(prev => prev.map(d => (d.id === doc.id ? updatedDoc : d)));
            setPreviewedDocIds(prev => new Set(prev).add(doc.id));
            setPreviewUri(filledImageUrl);
        } catch (error) {
            console.error('❌ Upload error:', error);
            Alert.alert('Error', 'Failed to process document');
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets.length > 0) {
                const file = result.assets[0];
                setTempFileUri(file.uri);
                setSelectedName('');
                setEditingDocId(null);
                setNamingModalVisible(true);
            }
        } catch (error) {
            Alert.alert('Error picking document', (error as Error).message);
        }
    };

    const confirmName = () => {
        if (!selectedName || !tempFileUri) return;
        const newDoc: Document = {
            id: Date.now().toString(),
            name: selectedName,
            uri: tempFileUri,
        };
        setDocuments(prev => [...prev, newDoc]);
        setTempFileUri(null);
        setSelectedName('');
        setEditingDocId(null);
        setNamingModalVisible(false);
        handleUploadAndPreview(newDoc);
    };

    const saveDocument = async (doc: Document) => {
        try {
            const extension = doc.uri.endsWith('.pdf') ? '.pdf' : '.png';
            const fileName = `${doc.name.replace(/\s+/g, '_')}_${Date.now()}${extension}`;
            const destUri = `${FileSystem.documentDirectory}${fileName}`;

            await FileSystem.downloadAsync(doc.uri, destUri);

            const storedDocsJson = await AsyncStorage.getItem(STORAGE_KEY);
            let storedDocs: Document[] = storedDocsJson ? JSON.parse(storedDocsJson) : [];

            storedDocs.push({ ...doc, uri: destUri });
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storedDocs));

            Alert.alert('Success', `Saved "${doc.name}" to local storage.`);
            setSavedDocIds(prev => new Set(prev).add(doc.id));
            DeviceEventEmitter.emit('documentsUpdated');
        } catch (error) {
            Alert.alert('Error saving document', (error as Error).message);
        }
    };



    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                <Text style={styles.uploadButtonText}>Upload PDF Document</Text>
            </TouchableOpacity>

            <FlatList
                data={documents}
                keyExtractor={(item) => item.id}
                style={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.docItem}>
                        <Text style={styles.docName}>{item.name}</Text>
                        <View style={styles.docButtonsRow}>
                            <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={() => {
                                    setPreviewUri(item.uri);
                                    setPreviewedDocIds(prev => new Set(prev).add(item.id));
                                }}
                            >
                                <Text style={styles.actionBtnText}>Preview</Text>
                            </TouchableOpacity>
                            {previewedDocIds.has(item.id) && !savedDocIds.has(item.id) && (
                                <TouchableOpacity
                                    style={styles.actionBtn}
                                    onPress={() => saveDocument(item)}
                                >
                                    <Text style={styles.actionBtnText}>Save</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            />

            <Modal visible={namingModalVisible} transparent animationType="fade">
                <View style={styles.namingModalBackground}>
                    <View style={styles.namingModalContainer}>
                        <Text style={styles.namingModalTitle}>Name your PDF</Text>
                        <View style={styles.namingOptionsRow}>
                            {['PPE Sheet', 'Induction checklist'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.namingOptionButton, selectedName === option && styles.namingOptionSelected]}
                                    onPress={() => setSelectedName(option)}
                                >
                                    <Text
                                        style={[styles.namingOptionText, selectedName === option && styles.namingOptionTextSelected]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={[styles.namingButton, selectedName ? styles.confirmButtonDisabledFalse : styles.confirmButtonDisabledTrue]}
                            onPress={confirmName}
                            disabled={!selectedName}
                        >
                            <Text style={styles.namingButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={previewUri !== null} animationType="slide">
                <View style={{ flex: 1 }}>
                    {previewUri && (
                        <WebView source={{ uri: previewUri }} style={{ flex: 1 }} originWhitelist={['*']} />
                    )}
                    <View style={styles.confirmCloseContainer}>
                        <TouchableOpacity
                            style={styles.confirmCloseButton}
                            onPress={() => setPreviewUri(null)}
                        >
                            <Text style={styles.confirmCloseButtonText}>Confirm Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1F3B60',
  },
  uploadButton: {
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 5,
    margin: 20,
    // shadowColor: '#000',
    // shadowOpacity: 0.6,
    // shadowRadius: 6,
    // shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00B0FF',
    textAlign:'center',
    textTransform: 'uppercase',
  },
  list: {
    marginTop: 10,
  },
  docItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 5,
    marginBottom: 16,
    // shadowColor: '#000',
    // shadowOpacity: 0.5,
    // shadowRadius: 5,
    // shadowOffset: { width: 0, height: 3 },
    // elevation: 6,
  },
  docName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  docButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 5,
    alignItems: 'center',
  },
  actionBtnText: {
    color: 'white',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  noDocsText: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: 16,
    fontStyle: 'italic',
  },
  namingModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  namingModalContainer: {
    backgroundColor: '#1C2A3D',
    padding: 20,
    borderRadius: 12,
    width: '85%',
  },
  namingModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  namingOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  namingOptionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
  },
  namingOptionSelected: {
    backgroundColor: '#D84343',
  },
  namingOptionText: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  namingOptionTextSelected: {
    color: 'black',
    fontWeight: '700',
  },
  namingButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
  confirmButtonDisabledTrue: {
    backgroundColor: '#666',
  },
  confirmButtonDisabledFalse: {
    backgroundColor: '#D84343',
  },
  namingButtonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  confirmCloseContainer: {
    padding: 15,
    backgroundColor: '#0B1A2F',
    borderTopWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
  },
  confirmCloseButton: {
    backgroundColor: '#D84343',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  confirmCloseButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});


