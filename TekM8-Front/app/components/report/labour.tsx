import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, Button, Provider as PaperProvider } from 'react-native-paper';

export default function LabourEntryScreen() {
  const { title, id } = useLocalSearchParams<{ title?: string; id?: string }>();
  const router = useRouter();

  const [labourEntry, setLabourEntry] = useState({
    area: '',
    level: '',
    trade: '',
    task: '',
    number: '',
  });

  const [entries, setEntries] = useState<any[]>([]);
  const storageKey = `labour-entries-${id}`;

  const areaOptions = ['Block A', 'Block B', 'Block C', 'Block D', 'Site wide'];
  const levelOptions = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
  const tradeOptions = ['fixer', 'plasterer', 'labourer', 'joiner', 'firestopper'];
  const taskOptions = ['1st fix', '2nd fix', 'plastering', 'sanding', 'firestopping', 'snagging'];

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored) setEntries(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load entries:', error);
      }
    };
    loadEntries();
  }, [id]);

  const saveEntries = async (newEntries: any[]) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newEntries));
    } catch (error) {
      console.error('Failed to save entries:', error);
    }
  };

  const handleLabourSubmit = () => {
    const { area, level, trade, task, number } = labourEntry;
    const levelRequired = area !== 'Site wide';

    if (!area || !trade || !task || !number || (levelRequired && !level)) {
      Alert.alert('Missing fields', 'Please complete all required fields.');
      return;
    }

    const updatedEntries = [...entries, { ...labourEntry }];
    setEntries(updatedEntries);
    saveEntries(updatedEntries);

    setLabourEntry({
      area: '',
      level: '',
      trade: '',
      task: '',
      number: '',
    });
  };

  const Dropdown = ({
    label,
    value,
    options,
    onSelect,
  }: {
    label: string;
    value: string;
    options: string[];
    onSelect: (val: string) => void;
  }) => {
    const [visible, setVisible] = useState(false);

    return (
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.label}>{label} *</Text>
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Button
              mode="contained-tonal"
              onPress={() => setVisible(true)}
              contentStyle={styles.dropdownBtn}
              textColor="#fff"
              style={{ backgroundColor: '#1F3B60', borderColor: '#2C3E50', borderWidth: 1 }}
            >
              {value || `Select ${label}`}
            </Button>
          }
        >
          {options.map((opt) => (
            <Menu.Item
              key={opt}
              onPress={() => {
                setVisible(false);
                onSelect(opt);
              }}
              title={opt}
            />
          ))}
        </Menu>
      </View>
    );
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to {title || 'Report'}</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Add Labour Entry</Text>

        <Dropdown
          label="Area"
          value={labourEntry.area}
          options={areaOptions}
          onSelect={(val) =>
            setLabourEntry({
              ...labourEntry,
              area: val,
              level: val === 'Site wide' ? '' : labourEntry.level,
            })
          }
        />

        {labourEntry.area !== 'Site wide' && (
          <Dropdown
            label="Level"
            value={labourEntry.level}
            options={levelOptions}
            onSelect={(val) => setLabourEntry({ ...labourEntry, level: val })}
          />
        )}

        <Dropdown
          label="Trade"
          value={labourEntry.trade}
          options={tradeOptions}
          onSelect={(val) => setLabourEntry({ ...labourEntry, trade: val })}
        />

        <Dropdown
          label="Task"
          value={labourEntry.task}
          options={taskOptions}
          onSelect={(val) => setLabourEntry({ ...labourEntry, task: val })}
        />

        <Text style={styles.label}>Number *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={labourEntry.number}
          onChangeText={(text) => setLabourEntry({ ...labourEntry, number: text })}
          placeholder="e.g. 3"
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleLabourSubmit}>
          <Text style={styles.submitText}>Submit Labour Entry</Text>
        </TouchableOpacity>

        {entries.length > 0 && (
          <View style={{ marginTop: 30 }}>
            <Text style={styles.header}>Submitted Entries</Text>
            {entries.map((entry, index) => (
              <View key={index} style={styles.entryCard}>
                <Text style={styles.entryText}>🏗 Area: {entry.area}</Text>
                {entry.area !== 'Site wide' && (
                  <Text style={styles.entryText}>🏢 Level: {entry.level}</Text>
                )}
                <Text style={styles.entryText}>🛠 Trade: {entry.trade}</Text>
                <Text style={styles.entryText}>📋 Task: {entry.task}</Text>
                <Text style={styles.entryText}>👥 Number: {entry.number}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B1A2F',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#66B2FF',
    fontSize: 16,
  },
  header: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    color: '#ccc',
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#1F3B60',
    borderColor: '#2C3E50',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  entryCard: {
    backgroundColor: '#16263D',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  entryText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  dropdownBtn: {
    justifyContent: 'flex-start',
    height: 48,
  },
});
