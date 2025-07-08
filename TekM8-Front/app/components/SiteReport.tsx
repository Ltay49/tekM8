import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';

const generateReportTitle = (index: number) => {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 16).replace('T', '_').replace(/:/g, '');
  return `Site Report-${index.toString().padStart(2, '0')}-${timestamp}`;
};

const SiteReport = () => {
  const [reports, setReports] = useState<any[]>([]);

  const createNewReport = () => {
    const newReport = {
      id: uuid.v4() as string,
      title: generateReportTitle(reports.length + 1),
      items: [],
    };
    setReports([newReport, ...reports]);
  };

  const addItemToReport = (reportId: string) => {
    const updatedReports = reports.map((report) => {
      if (report.id === reportId) {
        return {
          ...report,
          items: [
            ...report.items,
            {
              id: uuid.v4() as string,
              photo: null,
              notes: '',
            },
          ],
        };
      }
      return report;
    });
    setReports(updatedReports);
  };

  const handleTakePhoto = async (reportId: string, itemId: string) => {
    const result = await ImagePicker.launchCameraAsync({
      base64: false,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const photoUri = result.assets[0].uri;

      const updatedReports = reports.map((report) => {
        if (report.id === reportId) {
          return {
            ...report,
            items: report.items.map((item: any) =>
              item.id === itemId ? { ...item, photo: photoUri } : item
            ),
          };
        }
        return report;
      });

      setReports(updatedReports);
    }
  };

  const updateNotes = (reportId: string, itemId: string, text: string) => {
    const updatedReports = reports.map((report) => {
      if (report.id === reportId) {
        return {
          ...report,
          items: report.items.map((item: any) =>
            item.id === itemId ? { ...item, notes: text } : item
          ),
        };
      }
      return report;
    });
    setReports(updatedReports);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.newReportButton} onPress={createNewReport}>
        <Text style={styles.newReportText}>＋ Create New Report</Text>
      </TouchableOpacity>

      {reports.map((report) => (
        <View key={report.id} style={styles.reportCard}>
          <Text style={styles.reportTitle}>{report.title}</Text>

          <TouchableOpacity style={styles.addItemButton} onPress={() => addItemToReport(report.id)}>
            <Text style={styles.addItemText}>＋ Add Item</Text>
          </TouchableOpacity>

          {report.items.map((item: any) => (
            <View key={item.id} style={styles.itemBox}>
              <TouchableOpacity onPress={() => handleTakePhoto(report.id, item.id)}>
                <Text style={styles.cameraIcon}>📷</Text>
              </TouchableOpacity>

              {item.photo && (
                <Image source={{ uri: item.photo }} style={styles.imagePreview} />
              )}

              <TextInput
                style={styles.notesInput}
                multiline
                placeholder="Write notes here..."
                value={item.notes}
                onChangeText={(text) => updateNotes(report.id, item.id, text)}
              />
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingBottom: 100,
    backgroundColor: '#0B1A2F',
  },
  newReportButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  newReportText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  reportCard: {
    backgroundColor: '#16263D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  addItemButton: {
    backgroundColor: '#1C2C44',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  addItemText: {
    color: '#66B2FF',
    fontWeight: '500',
  },
  itemBox: {
    borderColor: '#334A68',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#132235',
  },
  cameraIcon: {
    fontSize: 32,
    marginBottom: 10,
    alignSelf: 'center',
    color: '#ffffff',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  notesInput: {
    minHeight: 80,
    borderColor: '#2C3E50',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    textAlignVertical: 'top',
    backgroundColor: '#0F1A2F',
    color: '#ffffff',
  },
});


export default SiteReport;
