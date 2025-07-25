import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  {
    id: 4,
    name: 'Jack White',
    qualification: 'Labourer',
    type: 'Labourer',
    gang: 'Agency',
    cards: ['CSCS'],
    inductionDate: '2024-05-01',
  },
  {
    id: 5,
    name: 'Dennis Taylor',
    qualification: 'NVQ Level 2 in Interior Systems',
    type: 'Fixer',
    gang: 'Vadim',
    cards: ['CSCS'],
    inductionDate: '2024-05-01',
  },
  {
    id: 6,
    name: 'Luke Humphries',
    qualification: 'NVQ Level 2 in Interior Systems',
    type: 'Fixer',
    gang: 'Vadim',
    cards: ['CSCS'],
    inductionDate: '2024-05-01',
  },
  {
    id: 7,
    name: 'Steve Davies',
    qualification: 'NVQ Level 2 in Interior Systems',
    type: 'Fixer',
    gang: 'Vadim',
    cards: ['CSCS'],
    inductionDate: '2024-05-01',
  },
  {
    id: 8,
    name: 'Alex Higgins',
    qualification: 'NVQ Level 2 in Interior Systems',
    type: 'Fixer',
    gang: 'Vadim',
    cards: ['CSCS'],
    inductionDate: '2024-05-01',
  },
  {
    id: 9,
    name: 'Mark Davies',
    qualification: 'NVQ Level 2 in Interior Systems',
    type: 'Fixer',
    gang: 'Vadim',
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
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // New state for group management
  const [groups, setGroups] = useState<{[key: string]: number[]}>({});
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showGroupsList, setShowGroupsList] = useState(false);

  // Load groups from AsyncStorage on component mount
  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const savedGroups = await AsyncStorage.getItem('workerGroups');
      if (savedGroups) {
        setGroups(JSON.parse(savedGroups));
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const saveGroups = async (groupsData: {[key: string]: number[]}) => {
    try {
      await AsyncStorage.setItem('workerGroups', JSON.stringify(groupsData));
    } catch (error) {
      console.error('Error saving groups:', error);
      Alert.alert('Error', 'Failed to save group. Please try again.');
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const selectAll = () => {
    const allIds = filteredDirectory.map((person) => person.id);
    setSelectedIds(allIds);
  };

  const addToGroup = () => {
    if (selectedIds.length === 0) {
      Alert.alert('No Selection', 'Please select at least one worker to add to a group.');
      return;
    }
    setShowGroupModal(true);
  };

  const createGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert('Invalid Name', 'Please enter a valid group name.');
      return;
    }

    if (groups[newGroupName]) {
      Alert.alert('Group Exists', 'A group with this name already exists. Please choose a different name.');
      return;
    }

    // Create new group with selected workers
    const newGroups = {
      ...groups,
      [newGroupName]: [...selectedIds]
    };
    
    setGroups(newGroups);
    await saveGroups(newGroups);
    
    Alert.alert('Success', `Group "${newGroupName}" created with ${selectedIds.length} workers.`);
    
    // Reset states
    setNewGroupName('');
    setShowGroupModal(false);
    cancelSelection();
  };

  const deleteGroup = (groupName: string) => {
    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete the group "${groupName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const newGroups = { ...groups };
            delete newGroups[groupName];
            setGroups(newGroups);
            await saveGroups(newGroups);
          }
        }
      ]
    );
  };

  const getWorkerNamesByIds = (workerIds: number[]) => {
    return directoryData
      .filter(worker => workerIds.includes(worker.id))
      .map(worker => worker.name);
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
      return (
        new Date(b.inductionDate).getTime() -
        new Date(a.inductionDate).getTime()
      );
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

      {/* Groups Management */}
      <TouchableOpacity
        style={styles.groupsButton}
        onPress={() => setShowGroupsList(!showGroupsList)}
      >
        <Text style={styles.dropdownText}>
          View Groups ({Object.keys(groups).length})
        </Text>
      </TouchableOpacity>

      {showGroupsList && Object.keys(groups).length > 0 && (
        <View style={styles.groupsList}>
          {Object.entries(groups).map(([groupName, workerIds]) => (
            <View key={groupName} style={styles.groupItem}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupName}>{groupName} ({workerIds.length})</Text>
                <TouchableOpacity onPress={() => deleteGroup(groupName)}>
                  <Text style={styles.deleteGroupIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.groupWorkers}>
                {getWorkerNamesByIds(workerIds).join(', ')}
              </Text>
            </View>
          ))}
        </View>
      )}

      {selectionMode && (
        <View style={styles.selectionControls}>
          <TouchableOpacity onPress={selectAll} style={styles.selectionButton}>
            <Text style={styles.selectionButtonText}>Select All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={cancelSelection} style={styles.selectionButton}>
            <Text style={styles.selectionButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={addToGroup} style={[styles.selectionButton, styles.primaryButton]}>
            <Text style={[styles.selectionButtonText, styles.primaryButtonText]}>Add to Group</Text>
          </TouchableOpacity>
        </View>
      )}

      <SectionList
        sections={groupedDirectory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              onLongPress={() => setSelectionMode(true)}
              onPress={() => selectionMode ? toggleSelection(item.id) : toggleExpand(item.id)}
              style={[styles.nameRow, selectionMode && { marginLeft: 20 }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {selectionMode && (
                  <Text style={{ marginRight: 8 }}>{selectedIds.includes(item.id) ? '✅' : '⬜'}</Text>
                )}
                <Text style={styles.nameOnly}>{item.name}</Text>
              </View>
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

      {/* Group Creation Modal */}
      <Modal
        visible={showGroupModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGroupModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Group</Text>
            <Text style={styles.modalSubtitle}>
              Selected Workers: {selectedIds.length}
            </Text>
            <Text style={styles.selectedWorkersList}>
              {getWorkerNamesByIds(selectedIds).join(', ')}
            </Text>
            
            <TextInput
              style={styles.groupNameInput}
              placeholder="Enter group name"
              value={newGroupName}
              onChangeText={setNewGroupName}
              autoFocus={true}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowGroupModal(false);
                  setNewGroupName('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalCreateButton}
                onPress={createGroup}
              >
                <Text style={styles.modalCreateText}>Create Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  groupsButton: {
    backgroundColor: '#EBF8FF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderColor: '#3B82F6',
    borderWidth: 1,
  },
  groupsList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  groupItem: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  deleteGroupIcon: {
    fontSize: 18,
  },
  groupWorkers: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  selectionControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  selectionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  selectionButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  primaryButtonText: {
    color: '#FFFFFF',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
    textAlign: 'center',
  },
  selectedWorkersList: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 18,
  },
  groupNameInput: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalCreateButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  modalCreateText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});