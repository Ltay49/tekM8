import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [projectName, setProjectName] = useState(`Project ${id}`);
  const [timeCompleted, setTimeCompleted] = useState('');

  return (
    <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back to Reports</Text>
      </TouchableOpacity>
 
      {/* Section 1 - Image Placeholder */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.imagePlaceholder}>
          <Text style={styles.cameraIcon}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Section 2 - Action Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>View Issues</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Format Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Share Report</Text>
        </TouchableOpacity>
      </View>

      {/* Section 3 - Editable Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Details</Text>

        <Text style={styles.label}>Project Name</Text>
        <TextInput
          style={styles.input}
          value={projectName}
          onChangeText={setProjectName}
        />

        <Text style={styles.label}>Time Completed</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 14:30"
          placeholderTextColor="#999"
          value={timeCompleted}
          onChangeText={setTimeCompleted}
        />
      </View>

    </View>
  );
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0B1A2F',
      paddingTop: 40,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 16,
      textAlign: 'center',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#66B2FF',
      marginBottom: 10,
    },
    imagePlaceholder: {
        backgroundColor: '#1F3B60',
      height: 180,
      borderRadius: 12,
      borderColor: '#334A68',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cameraIcon: {
      fontSize: 48,
      color: '#ffffff88',
    },
    actionButton: {
        backgroundColor: '#1F3B60',
      padding: 12,
      borderRadius: 8,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#1E3A5F',
    },
    actionText: {
      color: '#fff',
      fontSize: 15,
      textAlign: 'center',
    },
    label: {
      color: '#ccc',
      marginBottom: 6,
      marginTop: 10,
    },
    input: {
        backgroundColor: '#1F3B60',
      borderColor: '#2C3E50',
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      color: '#fff',
    },
    backButton: {
      paddingVertical: 12,
      marginTop: 10,
    },
    backButtonText: {
      color: 'white',
      fontSize: 14,
    },
  });
  
  