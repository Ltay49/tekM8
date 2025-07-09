import React, { useState } from 'react';
import {
    View, Text, Image, FlatList, StyleSheet,
    Alert, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Task {
    level: string;
    task: string;
    start: string;
    end: string;
}

const UploadPrograme: React.FC = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [programmeName, setProgrammeName] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:['images'],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            uploadImage(uri);
        }
    };

    const uploadImage = async (uri: string) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('image', {
                uri,
                name: 'programme.png',
                type: 'image/png',
            } as any);

            const response = await axios.post('http://192.168.0.37:3000/api/upload-fixers-tasks', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Upload failed:', error);
            Alert.alert('Upload failed', 'Could not upload image or extract tasks.');
        } finally {
            setLoading(false);
        }
    };

    const saveProgramme = async () => {
        if (!programmeName.trim()) {
            Alert.alert('Please name your programme.');
            return;
        }

        try {
            const existing = await AsyncStorage.getItem('programmes');
            const programmes = existing ? JSON.parse(existing) : [];

            const newProgramme = {
                name: programmeName.trim(),
                tasks,
                savedAt: new Date().toISOString(),
            };

            await AsyncStorage.setItem('programmes', JSON.stringify([...programmes, newProgramme]));

            // Clear UI state
            setProgrammeName('');
            setImageUri(null);
            setTasks([]);

            Alert.alert('Programme saved successfully!');
        } catch (error) {
            console.error('Save failed:', error);
            Alert.alert('Save failed. Try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.heading}>Press to upload your programme</Text>

                <TextInput
                    placeholder="Enter programme name"
                    placeholderTextColor="#ccc"
                    style={styles.input}
                    value={programmeName}
                    onChangeText={setProgrammeName}
                />

                {!imageUri && (
                    <Pressable style={styles.dashedBox} onPress={pickImage}>
                        <Text style={styles.dashedText}>Upload Programme</Text>
                    </Pressable>
                )}

                {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

                {loading && <Text style={styles.loadingText}>Extracting tasks...</Text>}

                {!loading && tasks.length > 0 && (
                    <>
                        <Text style={styles.subHeading}>Programme: {programmeName || 'Untitled'}</Text>
                        <FlatList
                            data={tasks}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.taskBox}>
                                    <Text style={styles.title}>{item.level}</Text>
                                    <Text>{item.task}</Text>
                                    <Text>{item.start} → {item.end}</Text>
                                </View>
                            )}
                        />

                        <TouchableOpacity style={styles.saveButton} onPress={saveProgramme}>
                            <Text style={styles.saveButtonText}>Save Programme</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#1F3B60',
        flexGrow: 1,
    },
    heading: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subHeading: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#2a4e75',
        borderRadius: 6,
        padding: 10,
        color: '#fff',
        marginBottom: 16,
    },
    dashedBox: {
        borderWidth: 2,
        borderColor: 'grey',
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
    },
    dashedText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#00B0FF',
    },
    image: {
        width: '100%',
        height: 200,
        marginTop: 16,
        resizeMode: 'contain',
    },
    loadingText: {
        marginTop: 16,
        color: '#fff',
        textAlign: 'center',
    },
    taskBox: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#eee',
        borderRadius: 8,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    saveButton: {
        marginTop: 24,
        backgroundColor: '#00B0FF',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default UploadPrograme;
