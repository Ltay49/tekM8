import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import uuid from 'react-native-uuid';
import { useRouter } from 'expo-router';
import NoteTaker from './NoteTaker';

const generateReportTitle = (index: number) => {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 16).replace('T', '_').replace(/:/g, '');
  return `Site Report-${index.toString().padStart(2, '0')}-${timestamp}`;
};

const SiteReport = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReportName, setNewReportName] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const router = useRouter();

  const handleCreateReport = () => {
    const title = newReportName.trim() || generateReportTitle(reports.length + 1);
    const newReport = {
      id: uuid.v4() as string,
      title,
      tag: selectedTag,
      items: [],
    };
    setReports([newReport, ...reports]);
    setNewReportName('');
    setSelectedTag('');
    setModalVisible(false);
  
    // ✅ Pass tag and id as query params to the report screen
    router.push({
      pathname: '/components/report/[id]',
      params: {
        id: newReport.id,
        tag: newReport.tag,
      },
    });
  };
  

  const openReport = (report: { id: string; tag: string }) => {
    router.push({
      pathname: '/components/report/[id]',
      params: {
        id: report.id,
        tag: report.tag,
      },
    });
  };
  
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.newReportButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.newReportText}>＋ Create New Report</Text>
      </TouchableOpacity>
    <NoteTaker />
      {reports.map((report) => (
        <View key={report.id} style={styles.reportCard}>
        <TouchableOpacity onPress={() => openReport(report)}>
            <Text style={styles.reportTitle}>
              {report.title}
              {report.tag ? ` (${report.tag})` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Naming Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Enter report name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Monday Morning Handover"
              placeholderTextColor="#999"
              value={newReportName}
              onChangeText={setNewReportName}
            />

            <Text style={styles.modalSubtitle}>Select a tag</Text>
            <View style={styles.tagContainer}>
              {['Labour Report', 'Progress Report', 'Safety Report'].map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    selectedTag === tag && styles.tagButtonSelected,
                  ]}
                  onPress={() => setSelectedTag(tag)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedTag === tag && styles.tagTextSelected,
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreateReport} style={styles.modalConfirm}>
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 100,
    backgroundColor: '#0B1A2F',
  },
  newReportButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
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
    color: '#ffffff',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#16263D',
    padding: 20,
    borderRadius: 12,
    width: '85%',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#0F1A2F',
    color: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2C3E50',
    padding: 10,
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 10,
  },
  tagButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2C3E50',
    borderRadius: 20,
  },
  tagButtonSelected: {
    backgroundColor: '#007AFF',
  },
  tagText: {
    color: '#ccc',
    fontSize: 14,
  },
  tagTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  modalConfirm: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SiteReport;
