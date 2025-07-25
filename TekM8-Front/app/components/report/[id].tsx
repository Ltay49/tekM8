import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import SignatureScreen, { SignatureViewRef } from 'react-native-signature-canvas';

type DABEntry = {
  description: string[];
  level: string[];
  area: string[];
  task: string[];
  attendees: string[];
};

export default function DABSReportScreen() {
  const { id, tag } = useLocalSearchParams<{ id?: string; tag?: string }>();
  const router = useRouter();

  const [entries, setEntries] = useState<DABEntry[]>([
    { description: [], level: [], area: [], task: [], attendees: [] },
  ]);

  const [descriptionTemplates] = useState([
    'General safety briefing',
    'Working at height precautions',
    'Toolbox talk on fire safety',
  ]);

  const [inputState, setInputState] = useState<Record<
    number,
    { description: string; level: string; area: string; task: string; attendee: string }
  >>({});

  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const signatureList = ['Alice Smith', 'Ben Jones', 'Carla White'];

  const [signingInfo, setSigningInfo] = useState<{ entryIndex: number; signer: string } | null>(null);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [signatures, setSignatures] = useState<Record<string, string>>({});

  const signatureRef = useRef<SignatureViewRef>(null);

  const updateEntryField = (index: number, field: keyof DABEntry, value: string) => {
    if (!value.trim()) return;
    const updated = [...entries];
    if (!updated[index][field].includes(value)) {
      updated[index][field].push(value);
      setEntries(updated);
    }

    setInputState((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: '',
      },
    }));
  };

  const removeTag = (index: number, field: keyof DABEntry, tagIndex: number) => {
    const updated = [...entries];
    updated[index][field].splice(tagIndex, 1);
    setEntries(updated);
  };

  const handleSignature = (signature: string) => {
    if (signingInfo) {
      const key = `${signingInfo.entryIndex}-${signingInfo.signer}`;
      setSignatures({ ...signatures, [key]: signature });
      setSignatureModalVisible(false);
    }
  };

  const addEntry = () => {
    setEntries([...entries, { description: [], level: [], area: [], task: [], attendees: [] }]);
  };

  const formatDateTime = (date: Date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${d}/${m}/${y} ${h}:${min}`;
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back to Reports</Text>
      </TouchableOpacity>

      <Text style={styles.header}>DABS - {formatDateTime(new Date())}</Text>

      {entries.map((entry, index) => {
        const input = inputState[index] || {
          description: '',
          level: '',
          area: '',
          task: '',
          attendee: '',
        };

        return (
          <View key={index} style={styles.entrySection}>
            <Text style={styles.entryTitle}>Brief #{index + 1}</Text>

            {/* DESCRIPTION */}
            <Text style={styles.label}>Description</Text>
            <View style={styles.tagsContainer}>
              {entry.description.map((desc, i) => (
                <TouchableOpacity key={i} style={styles.tag} onPress={() => removeTag(index, 'description', i)}>
                  <Text style={styles.tagText}>{desc} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Type a description"
              placeholderTextColor="#999"
              value={input.description}
              onChangeText={(text) =>
                setInputState((prev) => ({ ...prev, [index]: { ...prev[index], description: text } }))
              }
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={() => updateEntryField(index, 'description', input.description)}
            >
              <Text style={styles.addTagText}>+ Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={() => {
                setSelectedIndex(index);
                setShowDescriptionModal(true);
              }}
            >
              <Text style={styles.addTagText}>+ Add Tag from Saved</Text>
            </TouchableOpacity>

            {/* ATTENDEES */}
            <Text style={styles.label}>Attendees</Text>
            <View style={styles.tagsContainer}>
              {entry.attendees.map((name, i) => (
                <TouchableOpacity key={i} style={styles.tag} onPress={() => removeTag(index, 'attendees', i)}>
                  <Text style={styles.tagText}>{name} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Add attendee"
              placeholderTextColor="#999"
              value={input.attendee}
              onChangeText={(text) =>
                setInputState((prev) => ({ ...prev, [index]: { ...prev[index], attendee: text } }))
              }
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={() => updateEntryField(index, 'attendees', input.attendee)}
            >
              <Text style={styles.addTagText}>+ Add</Text>
            </TouchableOpacity>

            {/* LEVEL */}
            <Text style={styles.label}>Level</Text>
            <View style={styles.tagsContainer}>
              {entry.level.map((level, i) => (
                <TouchableOpacity key={i} style={styles.tag} onPress={() => removeTag(index, 'level', i)}>
                  <Text style={styles.tagText}>{level} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g. 5"
              placeholderTextColor="#999"
              value={input.level}
              onChangeText={(text) =>
                setInputState((prev) => ({ ...prev, [index]: { ...prev[index], level: text } }))
              }
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={() => updateEntryField(index, 'level', input.level)}
            >
              <Text style={styles.addTagText}>+ Add</Text>
            </TouchableOpacity>

            {/* AREA */}
            <Text style={styles.label}>Area</Text>
            <View style={styles.tagsContainer}>
              {entry.area.map((area, i) => (
                <TouchableOpacity key={i} style={styles.tag} onPress={() => removeTag(index, 'area', i)}>
                  <Text style={styles.tagText}>{area} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g. Riser A"
              placeholderTextColor="#999"
              value={input.area}
              onChangeText={(text) =>
                setInputState((prev) => ({ ...prev, [index]: { ...prev[index], area: text } }))
              }
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={() => updateEntryField(index, 'area', input.area)}
            >
              <Text style={styles.addTagText}>+ Add</Text>
            </TouchableOpacity>

            {/* TASK */}
            <Text style={styles.label}>Task</Text>
            <View style={styles.tagsContainer}>
              {entry.task.map((task, i) => (
                <TouchableOpacity key={i} style={styles.tag} onPress={() => removeTag(index, 'task', i)}>
                  <Text style={styles.tagText}>{task} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g. Installing fire collars"
              placeholderTextColor="#999"
              value={input.task}
              onChangeText={(text) =>
                setInputState((prev) => ({ ...prev, [index]: { ...prev[index], task: text } }))
              }
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={() => updateEntryField(index, 'task', input.task)}
            >
              <Text style={styles.addTagText}>+ Add</Text>
            </TouchableOpacity>

            {/* Signatures */}
            <Text style={[styles.label, { marginTop: 20 }]}>Signatures</Text>
            {signatureList.map((name, idx) => {
              const sigKey = `${index}-${name}`;
              const signature = signatures[sigKey];
              return (
                <View key={idx} style={styles.signatureRow}>
                  <Text style={styles.signatureName}>{name}</Text>
                  {signature ? (
                    <Image source={{ uri: signature }} style={styles.signatureImage} />
                  ) : (
                    <TouchableOpacity
                      style={styles.signatureBox}
                      onPress={() => {
                        setSigningInfo({ entryIndex: index, signer: name });
                        setSignatureModalVisible(true);
                      }}
                    >
                      <Text style={{ color: '#999', textAlign: 'center', fontSize: 12 }}>Tap to sign</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}

      <TouchableOpacity onPress={addEntry} style={styles.addEntryButton}>
        <Text style={styles.addEntryText}>+ Add Another Brief</Text>
      </TouchableOpacity>

      {/* Continue in Part 2 with modal and styles */}


      {/* Signature Modal */}
      {/* Signature Modal */}
      <Modal visible={signatureModalVisible} transparent animationType="fade">
        <View style={styles.centeredModalOverlay}>
          <View style={styles.signatureModalContainer}>
            <Text style={styles.signatureTitle}>Please Sign</Text>
            <SignatureScreen
              ref={signatureRef}
              onOK={handleSignature}
              onEmpty={() => alert('Please provide a signature')}
              descriptionText=""
              backgroundColor="#fff"
              penColor="#000"
              webStyle={`
                .m-signature-pad--footer { display: none; }
                .m-signature-pad { box-shadow: none; border: none; }
                body,html { background-color: white; }
              `}
            />
            <View style={styles.signatureModalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#999' }]}
                onPress={() => setSignatureModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#0B1A2F' }]}
                onPress={() => signatureRef.current?.readSignature()}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Description Modal */}
      <Modal visible={showDescriptionModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select a Description</Text>
            <FlatList
              data={descriptionTemplates}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    if (selectedIndex !== null) {
                      updateEntryField(selectedIndex, 'description', item);
                      setShowDescriptionModal(false);
                    }
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowDescriptionModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

      {/* Description Modal */}
      const styles = StyleSheet.create({
        container: { backgroundColor: '#0B1A2F', paddingTop: 40, paddingHorizontal: 20, flex: 1 },
        header: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
        entrySection: { backgroundColor: '#122B4D', padding: 16, borderRadius: 10, marginBottom: 20 },
        entryTitle: { fontSize: 16, color: '#ffffffaa', marginBottom: 10, fontWeight: 'bold' },
        label: { color: '#ccc', marginBottom: 6, marginTop: 10 },
        input: {
          backgroundColor: '#1F3B60',
          borderColor: '#2C3E50',
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          color: '#fff',
        },
        backButton: { paddingVertical: 12, marginTop: 10 },
        backButtonText: { color: 'white', fontSize: 14 },
        tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
        tag: { backgroundColor: '#1E3A5F', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginBottom:5 },
        tagText: { color: '#fff' },
        addTagButton: {
          backgroundColor: '#255784',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          marginTop: 8,
          alignSelf: 'flex-start',
        },
        addTagText: { color: '#fff', fontWeight: 'bold' },
        addEntryButton: {
          backgroundColor: '#1F3B60',
          padding: 12,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 30,
        },
        addEntryText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
        signatureRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        },
        signatureName: { color: '#fff', fontSize: 14 },
        signatureBox: {
          backgroundColor: '#fff',
          width: 120,
          height: 40,
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
        },
        signatureImage: {
          width: 120,
          height: 40,
          borderRadius: 4,
          resizeMode: 'contain',
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#ccc',
        },
        centeredModalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        },
        signatureModalContainer: {
          backgroundColor: '#fff',
          width: '90%',
          height: 400,
          borderRadius: 16,
          padding: 16,
          justifyContent: 'space-between',
        },
        signatureTitle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#000',
          marginBottom: 10,
          textAlign: 'center',
        },
        signatureModalButtons: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 12,
        },
        modalButton: {
          flex: 1,
          paddingVertical: 10,
          marginHorizontal: 6,
          borderRadius: 8,
          alignItems: 'center',
        },
        modalButtonText: { color: '#fff', fontWeight: 'bold' },
        modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        },
        modalBox: {
          backgroundColor: '#1F3B60',
          width: '80%',
          borderRadius: 12,
          padding: 20,
        },
        modalTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
        modalItem: { paddingVertical: 10 },
        modalItemText: { color: '#fff', fontSize: 14 },
        modalCancel: { color: '#ccc', fontSize: 14, marginTop: 20, textAlign: 'center' },
      });
      