import React, { useState, useEffect } from 'react';
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
    
    const [namingModalVisible, setNamingModalVisible] = useState(false);
    const [tempFileUri, setTempFileUri] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string>('');
    const [editingDocId, setEditingDocId] = useState<string | null>(null);
    const [sessionDocuments, setSessionDocuments] = useState<Document[]>([]);
    // Load documents on mount from AsyncStorage
    
    // Save documents to AsyncStorage whenever documents state changes
    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
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
        if (!selectedName) {
            Alert.alert('Please select a name option before confirming');
            return;
        }

        if (editingDocId) {
            // Rename existing document
            setDocuments((prev) =>
                prev.map((doc) =>
                    doc.id === editingDocId ? { ...doc, name: selectedName } : doc
                )
            );
        } else if (tempFileUri) {
            // Add new document
            setDocuments((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    name: selectedName,
                    uri: tempFileUri,
                },
            ]);
        }

        setTempFileUri(null);
        setSelectedName('');
        setEditingDocId(null);
        setNamingModalVisible(false);
    };

    const cancelNaming = () => {
        setTempFileUri(null);
        setSelectedName('');
        setEditingDocId(null);
        setNamingModalVisible(false);
    };

    const startEditName = (doc: Document) => {
        setEditingDocId(doc.id);
        setSelectedName(doc.name);
        setTempFileUri(null);
        setNamingModalVisible(true);

        // Enable Save again when editing
        setSavedDocIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(doc.id);
            return newSet;
        });
    };


    // Instead, update saveDocument like this:
    const saveDocument = async (doc: Document) => {
        try {
          const fileName = `${doc.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
          const destUri = `${FileSystem.documentDirectory}${fileName}`;
      
          await FileSystem.copyAsync({ from: doc.uri, to: destUri });
      
          // Get previously stored docs
          const storedDocsJson = await AsyncStorage.getItem(STORAGE_KEY);
          let storedDocs: Document[] = storedDocsJson ? JSON.parse(storedDocsJson) : [];
      
          // Add the current doc with new URI to stored docs
          storedDocs.push({ ...doc, uri: destUri });
      
          // Save merged array back to AsyncStorage
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storedDocs));
      
          Alert.alert('Success', `Saved "${doc.name}" to local storage.`);
      
          // Remove saved doc from session documents state so it disappears from list
          setDocuments((prevDocs) => prevDocs.filter(d => d.id !== doc.id));
      
          // Add to savedDocIds so UI disables Save button if you want (optional)
          setSavedDocIds((prev) => new Set(prev).add(doc.id));
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

            {documents.length === 0 ? (
                <Text style={styles.noDocsText}>No documents uploaded yet.</Text>
            ) : (
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
                                    onPress={() => startEditName(item)}
                                >
                                    <Text style={styles.actionBtnText}>Edit Name</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionBtn}
                                    onPress={() => setPreviewUri(item.uri)}
                                >
                                    <Text style={styles.actionBtnText}>Preview</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.actionBtn,
                                        savedDocIds.has(item.id) && styles.actionBtnDisabled, // optionally add a disabled style
                                    ]}
                                    onPress={() => saveDocument(item)}
                                    disabled={savedDocIds.has(item.id)}
                                >
                                    <Text
                                        style={[
                                            styles.actionBtnText,
                                            savedDocIds.has(item.id) && styles.actionBtnTextDisabled,
                                        ]}
                                    >
                                        Save
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}

            {/* Naming Modal */}
            <Modal visible={namingModalVisible} transparent animationType="fade">
                <View style={styles.namingModalBackground}>
                    <View style={styles.namingModalContainer}>
                        <Text style={styles.namingModalTitle}>Name your PDF</Text>

                        <View style={styles.namingOptionsRow}>
                            {['PPE Sheet', 'Induction checklist'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.namingOptionButton,
                                        selectedName === option && styles.namingOptionSelected,
                                    ]}
                                    onPress={() => setSelectedName(option)}
                                >
                                    <Text
                                        style={[
                                            styles.namingOptionText,
                                            selectedName === option && styles.namingOptionTextSelected,
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.namingButtonsRow}>
                            <TouchableOpacity
                                style={[styles.namingButton, styles.cancelButton]}
                                onPress={cancelNaming}
                            >
                                <Text style={styles.namingButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.namingButton,
                                    selectedName ? styles.confirmButtonDisabledFalse : styles.confirmButtonDisabledTrue,
                                ]}
                                onPress={confirmName}
                                disabled={!selectedName}
                            >
                                <Text style={styles.namingButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* PDF Preview Modal */}
            <Modal visible={previewUri !== null} animationType="slide">
                <View style={{ flex: 1 }}>
                    {previewUri && (
                        <WebView
                            source={{ uri: previewUri }}
                            style={{ flex: 1 }}
                            originWhitelist={['*']}
                        />
                    )}
                    <View style={styles.confirmCloseContainer}>
                        <TouchableOpacity
                            style={styles.confirmCloseButton}
                            onPress={() => setPreviewUri(null)}
                        >
                            <Text style={styles.confirmCloseButtonText}>Confirm Close PDF</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// Add your existing styles here


const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    docItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    docName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    docButtonsRow: {
        
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionBtn: {
        flex: 1,
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        marginHorizontal: 4,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
    uploadButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    uploadButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Montserrat_700Bold', 
        fontSize: 16,
    },
    noDocsText: { textAlign: 'center', color: '#999', fontSize: 16 },
    list: { marginTop: 10 },

    docButtons: {
        flexDirection: 'row',
        gap: 8,
    },

    previewBtn: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 8,
        marginRight: 8,
    },
    previewBtnText: { color: '#fff', fontWeight: '600' },

    editBtn: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
        marginRight: 8,
    },
    editBtnText: { color: '#fff', fontWeight: '600' },

    saveBtn: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 8,
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: '600',
    },

    confirmCloseContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
    },
    confirmCloseButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    confirmCloseButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

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
        width: '85%',
    },
    namingModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
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
        borderColor: '#007AFF',
        borderRadius: 8,
    },
    namingOptionSelected: {
        backgroundColor: '#007AFF',
    },
    namingOptionText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    namingOptionTextSelected: {
        color: '#fff',
    },
    namingButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    namingButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: '#aaa',
        marginRight: 10,
    },
    confirmButtonDisabledTrue: {
        backgroundColor: '#ccc',
    },
    confirmButtonDisabledFalse: {
        backgroundColor: '#007AFF',
    },
    namingButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    actionBtnDisabled: {
        opacity: 0.5,
      },
      
      actionBtnTextDisabled: {
        color: '#999',
      },
});

