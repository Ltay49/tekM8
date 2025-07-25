import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import uuid from 'react-native-uuid';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoteTaker from './NoteTaker';

const generateReportTitle = (type: string) => {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
  return `${type}_${timestamp}`;
};

const SiteReport = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const router = useRouter();

  // Load reports from AsyncStorage on component mount
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const savedReports = await AsyncStorage.getItem('allReports');
      if (savedReports) {
        setReports(JSON.parse(savedReports));
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const saveReports = async (reportsData: any[]) => {
    try {
      await AsyncStorage.setItem('allReports', JSON.stringify(reportsData));
    } catch (error) {
      console.error('Error saving reports:', error);
      Alert.alert('Error', 'Failed to save report. Please try again.');
    }
  };

  const handleCreateReport = async () => {
    if (!selectedReportType) {
      Alert.alert('Error', 'Please select a report type');
      return;
    }

    const reportId = uuid.v4() as string;
    const title = generateReportTitle(selectedReportType);
    
    const newReport = {
      id: reportId,
      title,
      type: selectedReportType,
      createdAt: new Date().toISOString(),
      folderPath: selectedReportType === 'DABS' ? `Reports/DABS/${reportId}` : `Reports/Site_Reports/${reportId}`,
      items: [],
    };

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    await saveReports(updatedReports);
    
    setSelectedReportType('');
    setModalVisible(false);

    // Navigate to the report with folder structure info
    router.push({
      pathname: '/components/report/[id]',
      params: {
        id: newReport.id,
        type: newReport.type,
        folderPath: newReport.folderPath,
        title: newReport.title,
      },
    });
  };

  const openReport = (report: any) => {
    router.push({
      pathname: '/components/report/[id]',
      params: {
        id: report.id,
        type: report.type,
        folderPath: report.folderPath,
        title: report.title,
      },
    });
  };

  const deleteReport = async (reportId: string) => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedReports = reports.filter(report => report.id !== reportId);
            setReports(updatedReports);
            await saveReports(updatedReports);
          }
        }
      ]
    );
  };

  // Group reports by type for better organization
  const dabsReports = reports.filter(report => report.type === 'DABS');
  const siteReports = reports.filter(report => report.type === 'Site Report');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.newReportButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.newReportText}>＋ Create New Report</Text>
      </TouchableOpacity>
      
      <NoteTaker />

      {/* DABS Reports Section */}
      {dabsReports.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>DABS Reports</Text>
          <Text style={styles.sectionPath}>Reports/DABS/</Text>
          {dabsReports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <TouchableOpacity onPress={() => openReport(report)} style={styles.reportContent}>
                <View style={styles.reportHeader}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportType}>DABS</Text>
                </View>
                <Text style={styles.reportPath}>{report.folderPath}</Text>
                <Text style={styles.reportDate}>
                  Created: {new Date(report.createdAt).toLocaleString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteReport(report.id)}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Site Reports Section */}
      {siteReports.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Site Reports</Text>
          <Text style={styles.sectionPath}>Reports/Site_Reports/</Text>
          {siteReports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <TouchableOpacity onPress={() => openReport(report)} style={styles.reportContent}>
                <View style={styles.reportHeader}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportType}>Site Report</Text>
                </View>
                <Text style={styles.reportPath}>{report.folderPath}</Text>
                <Text style={styles.reportDate}>
                  Created: {new Date(report.createdAt).toLocaleString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteReport(report.id)}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {reports.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No reports created yet</Text>
          <Text style={styles.emptyStateSubtext}>Tap "Create New Report" to get started</Text>
        </View>
      )}

      {/* Report Type Selection Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Report Type</Text>
            <Text style={styles.modalSubtitle}>Choose the type of report to create</Text>

            <View style={styles.reportTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.reportTypeButton,
                  selectedReportType === 'DABS' && styles.reportTypeButtonSelected,
                ]}
                onPress={() => setSelectedReportType('DABS')}
              >
                <Text style={styles.reportTypeIcon}>📊</Text>
                <Text
                  style={[
                    styles.reportTypeText,
                    selectedReportType === 'DABS' && styles.reportTypeTextSelected,
                  ]}
                >
                  DABS
                </Text>
                <Text style={styles.reportTypeDescription}>
                  Will be saved to: Reports/DABS/[ID]
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.reportTypeButton,
                  selectedReportType === 'Site Report' && styles.reportTypeButtonSelected,
                ]}
                onPress={() => setSelectedReportType('Site Report')}
              >
                <Text style={styles.reportTypeIcon}>🏗️</Text>
                <Text
                  style={[
                    styles.reportTypeText,
                    selectedReportType === 'Site Report' && styles.reportTypeTextSelected,
                  ]}
                >
                  Site Report
                </Text>
                <Text style={styles.reportTypeDescription}>
                  Will be saved to: Reports/Site_Reports/[ID]
                </Text>
              </TouchableOpacity>
            </View>

            {selectedReportType && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>Report will be named:</Text>
                <Text style={styles.previewName}>{generateReportTitle(selectedReportType)}</Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                onPress={() => {
                  setModalVisible(false);
                  setSelectedReportType('');
                }} 
                style={styles.modalCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleCreateReport} 
                style={[
                  styles.modalConfirm,
                  !selectedReportType && styles.modalConfirmDisabled
                ]}
                disabled={!selectedReportType}
              >
                <Text style={styles.modalButtonText}>Create Report</Text>
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
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  newReportText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  sectionPath: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 15,
    fontFamily: 'monospace',
  },
  reportCard: {
    backgroundColor: '#16263D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportContent: {
    flex: 1,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  reportType: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
  },
  reportPath: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    color: '#aaa',
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
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
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  reportTypeContainer: {
    gap: 15,
    marginBottom: 20,
  },
  reportTypeButton: {
    backgroundColor: '#2C3E50',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  reportTypeButtonSelected: {
    backgroundColor: '#1E3A5F',
    borderColor: '#007AFF',
  },
  reportTypeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  reportTypeText: {
    color: '#ccc',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  reportTypeTextSelected: {
    color: '#fff',
  },
  reportTypeDescription: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  previewContainer: {
    backgroundColor: '#0F1A2F',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2C3E50',
  },
  previewTitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 5,
  },
  previewName: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalConfirm: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalConfirmDisabled: {
    backgroundColor: '#555',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SiteReport;