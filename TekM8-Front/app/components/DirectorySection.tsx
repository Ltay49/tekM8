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
  {
    id: 1,
    name: 'Alice Smith',
    qualification: 'Supervisor',
    type: 'Supervisor',
    gang: 'LT-Fittings',
    cards: ['CSCS', 'IPAF'],
    inductionDate: '2024-04-10',
  },
  {
    id: 2,
    name: 'Ben Jones',
    qualification: 'Electrician',
    type: 'Electrician',
    gang: 'PowerTech',
    cards: ['PASMA'],
    inductionDate: '2024-03-15',
  },
  {
    id: 3,
    name: 'Carla White',
    qualification: 'Labourer',
    type: 'Labourer',
    gang: 'SiteWorks',
    cards: ['CSCS'],
    inductionDate: '2024-05-01',
  },
];

const filterOptions = [
  'All',
  'Type ---',
  'Supervisor',
  'Electrician',
  'Labourer',
  'Card ---',
  'CSCS',
  'IPAF',
  'PASMA',
  'Gang ---',
  'LT-Fittings',
  'PowerTech',
  'SiteWorks',
];

export default function DirectorySection() {
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('All');
  const [showOptions, setShowOptions] = useState(false);
  const [sortByDate, setSortByDate] = useState(false);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredDirectory = directoryData
    .filter((person) => {
      const matchSearch = person.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      if (filter === 'All' || filter.endsWith('---')) return matchSearch;

      return (
        matchSearch &&
        (person.type === filter ||
          person.gang === filter ||
          person.cards.includes(filter))
      );
    })
    .sort((a, b) => {
      if (!sortByDate) return 0;
      return new Date(b.inductionDate).getTime() - new Date(a.inductionDate).getTime();
    });

  type Section = {
    title: string;
    data: typeof directoryData;
  };

  const groupedDirectory: Section[] = Object.values(
    filteredDirectory.reduce((acc, person) => {
      const firstLetter = person.name[0].toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = { title: firstLetter, data: [] };
      acc[firstLetter].data.push(person);
      return acc;
    }, {} as Record<string, Section>)
  ).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <View style={styles.sectionHow}>
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
        <Text style={styles.dropdownText}>{filter}</Text>
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.dropdownList}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                setFilter(option);
                setShowOptions(false);
              }}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => setSortByDate((prev) => !prev)}
      >
        <Text style={styles.dropdownText}>
          {sortByDate ? 'Sorted by Induction Date' : 'Sort by Induction Date'}
        </Text>
      </TouchableOpacity>

      <SectionList
        sections={groupedDirectory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              onPress={() => toggleExpand(item.id)}
              style={styles.nameRow}
            >
              <Text style={styles.nameOnly}>{item.name}</Text>
              <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => console.log('Edit', item.id)}>
                  <Text style={styles.icon}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('Delete', item.id)}>
                  <Text style={styles.icon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            {expandedIds.includes(item.id) && (
              <View style={styles.detailsBox}>
                <Text>Type: {item.type}</Text>
                <Text>Gang: {item.gang}</Text>
                <Text>Cards: {item.cards.join(', ')}</Text>
                <Text>Induction Date: {item.inductionDate}</Text>
              </View>
            )}
          </View>
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
    padding: 10,
    height: '100%',
  },
  searchInput: {
    marginTop: 50,
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
  sortButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },
  nameOnly: {
    fontSize: 15,
    color: '#111827',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 10,
  },
  icon: {
    fontSize: 16,
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontWeight: '600',
    fontSize: 14,
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
  },
  detailsBox: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#111827',
  },
});
