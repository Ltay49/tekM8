import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailsAutomation() {
  const [form, setForm] = useState({
    name: '',
    date: '', // you can default to today with new Date().toISOString().slice(0,10)
    project: '',
    projectCode: '',
    checklist: {
      readMaterials: false,
      emergencyProcedures: false,
      siteRules: false,
      accidentProcedure: false,
      ppeRequirements: false,
      siteHazards: false,
      welfareFacilities: false,
      permitSystems: false,
      managementTeamIntro: false,
      timings: false,
    },
    inducteeSignature: '',
    siteManagerSignature: '',
  });

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const json = await AsyncStorage.getItem('userDetails');
        if (json) {
          const savedDetails = JSON.parse(json);
          setForm((prev) => ({
            ...prev,
            name: `${savedDetails.firstName} ${savedDetails.surname}`,
            project: savedDetails.projectName,
            projectCode: savedDetails.projectCode,
            date: new Date().toISOString().slice(0, 10), // today's date as default
          }));
        }
      } catch (e) {
        console.error('Error loading user details', e);
      }
    };

    loadUserDetails();
  }, []);

  const handleChange = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Checkbox toggle handler
  const toggleChecklistItem = (key: keyof typeof form.checklist) => {
    setForm((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [key]: !prev.checklist[key],
      },
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Induction Checklist</Text>

      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      <Text>Date:</Text>
      <TextInput
        style={styles.input}
        value={form.date}
        onChangeText={(text) => handleChange('date', text)}
      />

      <Text>Project:</Text>
      <TextInput
        style={styles.input}
        value={form.project}
        onChangeText={(text) => handleChange('project', text)}
      />

      <Text>Project Code:</Text>
      <TextInput
        style={styles.input}
        value={form.projectCode}
        onChangeText={(text) => handleChange('projectCode', text)}
      />

      <Text style={{ marginTop: 20, fontWeight: '700' }}>Site Induction Checksheet</Text>

      {Object.entries(form.checklist).map(([key, checked]) => (
        <View key={key} style={styles.checkboxRow}>
          <Text
            onPress={() => toggleChecklistItem(key as keyof typeof form.checklist)}
            style={{ fontSize: 16 }}
          >
            {checked ? '[x]' : '[ ]'} {formatChecklistLabel(key)}
          </Text>
        </View>
      ))}

      <Text style={{ marginTop: 20 }}>Inductee Signature:</Text>
      <TextInput
        style={styles.signatureInput}
        value={form.inducteeSignature}
        onChangeText={(text) => handleChange('inducteeSignature', text)}
        placeholder="Sign here"
      />

      <Text style={{ marginTop: 20 }}>Site Manager Signature:</Text>
      <TextInput
        style={styles.signatureInput}
        value={form.siteManagerSignature}
        onChangeText={(text) => handleChange('siteManagerSignature', text)}
        placeholder="Sign here"
      />
    </ScrollView>
  );
}

// Helper to convert checklist keys to readable labels
function formatChecklistLabel(key: string) {
  const map: Record<string, string> = {
    readMaterials: 'Read and understood the site induction materials',
    emergencyProcedures: 'Aware of emergency evacuation procedures',
    siteRules: 'Aware of site rules and safety protocols',
    accidentProcedure: 'Aware of accident reporting procedure',
    ppeRequirements: 'PPE requirements explained and acknowledged',
    siteHazards: 'Informed of site-specific hazards',
    welfareFacilities: 'Shown welfare and first aid facilities',
    permitSystems: 'Informed of permit-to-work systems (if applicable)',
    managementTeamIntro: 'Introduced to site management team',
    timings: 'Informed of start/finish times and breaks',
  };
  return map[key] || key;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  checkboxRow: {
    marginVertical: 4,
  },
  signatureInput: {
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontStyle: 'italic',
  },
});
