import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from 'react-native';

const directoryData = [
  { id: 1, name: 'Alice Smith', qualification: 'Supervisor' },
  { id: 2, name: 'Ben Jones', qualification: 'Electrician' },
  { id: 3, name: 'Carla White', qualification: 'Labourer' },
  { id: 4, name: 'Dylan Ray', qualification: 'Supervisor' },
  { id: 5, name: 'Emma Stone', qualification: 'Electrician' },
];

const qualificationOptions = ['All', 'Supervisor', 'Electrician', 'Labourer'];

export default function DirectorySection() {
  const [searchText, setSearchText] = useState('');
  const [qualificationFilter, setQualificationFilter] = useState('All');
  const [showOptions, setShowOptions] = useState(false);

  const filteredDirectory = directoryData.filter(
    (person) =>
      person.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (qualificationFilter === 'All' || person.qualification === qualificationFilter)
  );

  const groupedDirectory = Object.values(
    filteredDirectory.reduce((acc, person) => {
      const firstLetter = person.name[0].toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = { title: firstLetter, data: [] };
      acc[firstLetter].data.push(person);
      return acc;
    }, {} as Record<string, { title: string; data: typeof directoryData }>)
  ).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <View style={styles.sectionHow}>
      {/* <Text style={styles.sectionTitle}>Operative list</Text> */}

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name"
        onChangeText={setSearchText}
        value={searchText}
      />

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowOptions(!showOptions)}
      >
        <Text style={styles.dropdownText}>{qualificationFilter}</Text>
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.dropdownList}>
          {qualificationOptions.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                setQualificationFilter(option);
                setShowOptions(false);
              }}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <SectionList
        sections={groupedDirectory}
        keyExtractor={(item) => item.id.toString()}
        stickySectionHeadersEnabled
        renderItem={({ item }) => (
          <Text style={styles.directoryItem}>
            {item.name} — {item.qualification}
          </Text>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHow: {
    backgroundColor: '#fff',
    // borderRadius: 14,
    marginBottom: 24,
    padding: 10,
    height:'100%'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1F2937',
  },
  searchInput: {
    marginTop:50,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 10,
    marginVertical: 6,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    fontSize: 14,
    color: '#111827',
  },
  dropdownButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginBottom: 6,
  },
  dropdownText: {
    fontSize: 14,
    color: '#111827',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginBottom: 8,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#111827',
  },
  directoryItem: {
    fontSize: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    color: '#111827',
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontWeight: '600',
    fontSize: 14,
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
  },
});
