import { useLocalSearchParams } from 'expo-router';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Button,
    Modal,
    TouchableOpacity,
    Image,
} from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Calander from '../Calander'
import { Alert } from 'react-native'; // Make sure this is imported


const COMMENT_TAGS = ['delay', 'labour', 'materials', 'spec', 'logistics', 'other'];
const TASK_TAGS = ['QA', 'Materials', 'Build', 'Meeting'];
const TEAM_MEMBERS = ['Dave', 'Ayesha', 'Liam', 'Rosa', 'Tariq'];

export default function HandoverDetail() {
    const { id, section, date } = useLocalSearchParams();
    const [commentsList, setCommentsList] = useState<CommentItem[]>([]);
    const [taskList, setTaskList] = useState<TaskItem[]>([]);


    // Comment Modal State
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [selectedCommentTags, setSelectedCommentTags] = useState<string[]>([]);
    const [commentText, setCommentText] = useState('');
    const [imageUri, setImageUri] = useState('');

    // Task Modal State
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [taskTags, setTaskTags] = useState<string[]>([]);
    const [assignedTo, setAssignedTo] = useState<string[]>([]);
    const [taskComment, setTaskComment] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');

    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
    const [taskViewModalVisible, setTaskViewModalVisible] = useState(false);

    type CommentItem = {
        tags: string[];
        text: string;
        image: string;
    };

    type TaskItem = {
        tags: string[];
        assignedTo: string[];
        comment: string;
        dueDate: string;
        isCompleted?: boolean;
        delayReason?: string;
        newDueDate?: string;
        completedImage?: string;
      };
      
      const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);
      const [delayModalVisible, setDelayModalVisible] = useState(false);
      const [delayReasonInput, setDelayReasonInput] = useState('');
      const [delayNewDate, setDelayNewDate] = useState('');
      
      const handleCompleteTask = () => {
        Alert.alert(
          'Add a Photo?',
          'Would you like to attach a photo to this completed task?',
          [
            {
              text: 'No',
              onPress: () => markTaskAsComplete(''), // complete with no image
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  quality: 0.7,
                  allowsEditing: true,
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                });
      
                if (!result.canceled && result.assets.length > 0) {
                  markTaskAsComplete(result.assets[0].uri);
                } else {
                  markTaskAsComplete('');
                }
              },
            },
          ],
          { cancelable: true }
        );
      };
      
      const markTaskAsComplete = (image: string) => {
        if (selectedTaskIndex !== null) {
          const updated = [...taskList];
          updated[selectedTaskIndex].isCompleted = true;
          if (image) updated[selectedTaskIndex].completedImage = image;
          setTaskList(updated);
          setSelectedTask(updated[selectedTaskIndex]); // ✅ update modal too
        }
        setTaskViewModalVisible(false);
      };
      
      
      
      const handleDelayTask = () => {
        if (selectedTaskIndex !== null) {
          const updated = [...taskList];
          updated[selectedTaskIndex].delayReason = delayReasonInput;
          updated[selectedTaskIndex].newDueDate = delayNewDate;
          setTaskList(updated);
        }
        setDelayModalVisible(false);
        setTaskViewModalVisible(false);
      };
      

    const toggleTag = (tag: string, selected: string[], setSelected: Function) => {
        setSelected(selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            quality: 0.7,
            allowsEditing: true,
            mediaTypes: ['images'],
        });

        if (!result.canceled && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleAddComment = () => {
        if (!commentText || selectedCommentTags.length === 0) return;

        setCommentsList(prev => [
            ...prev,
            { tags: selectedCommentTags, text: commentText, image: imageUri },
        ]);

        setSelectedCommentTags([]);
        setCommentText('');
        setImageUri('');
        setCommentModalVisible(false);
    };

    const handleAddTask = () => {
        if (!taskComment || taskTags.length === 0 || assignedTo.length === 0 || !taskDueDate) return;

        setTaskList(prev => [
            ...prev,
            { tags: taskTags, assignedTo, comment: taskComment, dueDate: taskDueDate },
        ]);

        setTaskTags([]);
        setAssignedTo([]);
        setTaskComment('');
        setTaskDueDate('');
        setTaskModalVisible(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{section}</Text>
            <Text style={styles.subheading}>Due: {date}</Text>

            {/* COMMENTS */}
            <Text style={styles.label}>Comments</Text>
            {commentsList.length === 0 ? (
                <Text style={styles.noComments}>No comments added yet.</Text>
            ) : (
                commentsList.map((c, i) => (
                    <View key={i} style={styles.commentItem}>
                        <Text style={styles.commentTag}>{c.tags.map(t => t.toUpperCase()).join(', ')}</Text>
                        <Text style={styles.commentText}>{c.text}</Text>
                        {c.image && <Image source={{ uri: c.image }} style={styles.previewImage} />}
                    </View>
                ))
            )}
            <TouchableOpacity style={styles.addButton} onPress={() => setCommentModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Add Comment</Text>
            </TouchableOpacity>

            {/* TASKS */}
            <Text style={styles.label}>Assigned Tasks</Text>
            {taskList.length === 0 ? (
                <Text style={styles.noComments}>No tasks assigned yet.</Text>
            ) : (
                taskList.map((t, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.commentItem, t.isCompleted && { opacity: 0.5 }]}
                      onPress={() => {
                        setSelectedTaskIndex(i);                 // sets the index of the tapped task
                        setSelectedTask(taskList[i]);            // sets the actual task object for modal display ✅
                        setTaskViewModalVisible(true);           // opens the modal
                      }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.commentTag}>
                          {t.tags.map(tag => tag.toUpperCase()).join(', ')} - {t.newDueDate || t.dueDate}
                        </Text>
                        {t.isCompleted && <Text style={{ color: 'lime', fontSize: 18 }}>✅</Text>}
                      </View>
                      <Text style={styles.commentText}>To: {t.assignedTo.join(', ')}</Text>
                      <Text style={styles.commentText}>{t.comment}</Text>
                      {t.delayReason && <Text style={styles.commentText}>⏳ Delayed: {t.delayReason}</Text>}
                      {t.completedImage && (
                        <Image source={{ uri: t.completedImage }} style={styles.previewImage} />
                      )}
                    </TouchableOpacity>
                  ))
                  

            )}
            <TouchableOpacity style={styles.addButton} onPress={() => setTaskModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Assign Task</Text>
            </TouchableOpacity>

            {/* COMMENT MODAL */}
            <Modal visible={commentModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.label}>Select Tags</Text>
                        <View style={styles.tagContainer}>
                            {COMMENT_TAGS.map(tag => (
                                <TouchableOpacity
                                    key={tag}
                                    style={[
                                        styles.tag,
                                        selectedCommentTags.includes(tag) && styles.selectedTag,
                                    ]}
                                    onPress={() => toggleTag(tag, selectedCommentTags, setSelectedCommentTags)}
                                >
                                    <Text style={styles.tagText}>{tag}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Comment</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter comment..."
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline
                        />

                        <Button title="Pick Image" onPress={pickImage} />
                        {imageUri ? <Image source={{ uri: imageUri }} style={styles.previewImage} /> : null}

                        <View style={styles.modalActions}>
                            <Button title="Cancel" onPress={() => setCommentModalVisible(false)} />
                            <Button title="Save" onPress={handleAddComment} />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* TASK MODAL */}
            <Modal visible={taskModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.label}>Select Tags:</Text>
                        <View style={styles.tagContainer}>
                            {TASK_TAGS.map(tag => (
                                <TouchableOpacity
                                    key={tag}
                                    style={[styles.tag, taskTags.includes(tag) && styles.selectedTag]}
                                    onPress={() => toggleTag(tag, taskTags, setTaskTags)}
                                >
                                    <Text style={styles.tagText}>{tag}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Assign To:</Text>
                        <View style={styles.tagContainer}>
                            {TEAM_MEMBERS.map(member => (
                                <TouchableOpacity
                                    key={member}
                                    style={[styles.tag, assignedTo.includes(member) && styles.selectedTag]}
                                    onPress={() => toggleTag(member, assignedTo, setAssignedTo)}
                                >
                                    <Text style={styles.tagText}>{member}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Comment</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Task details..."
                            value={taskComment}
                            onChangeText={setTaskComment}
                            multiline
                        />

                        {/* Insert Calander */}
                        <Text style={styles.label}>
                            Due Date: {taskDueDate ? taskDueDate : ''}
                        </Text>
                        <Calander onDateSelect={(selected) => setTaskDueDate(selected)} />



                        <View style={styles.modalActions}>
                            <Button title="Cancel" onPress={() => setTaskModalVisible(false)} />
                            <Button title="Save" onPress={handleAddTask} />
                        </View>
                    </View>
                </View>
            </Modal>
            {/* review task */}
            <Modal visible={taskViewModalVisible} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {selectedTask && (
        <>
          <Text style={styles.label}>Tags:</Text>
          <Text style={styles.commentText}>{selectedTask.tags.join(', ')}</Text>

          <Text style={styles.label}>Assigned To:</Text>
          <Text style={styles.commentText}>{selectedTask.assignedTo.join(', ')}</Text>

          <Text style={styles.label}>Due Date:</Text>
          <Text style={styles.commentText}>{selectedTask.dueDate}</Text>

          <Text style={styles.label}>Comment:</Text>
          <Text style={styles.commentText}>{selectedTask.comment}</Text>
        </>
      )}

      <View style={styles.modalActions}>
        <Button title="Close" onPress={() => setTaskViewModalVisible(false)} />
        <View style={styles.modalActions}>
  <Button title="Complete" onPress={handleCompleteTask} />
  <Button title="Delay" onPress={() => {
    setDelayModalVisible(true);
    setTaskViewModalVisible(false);
  }} />
</View>

      </View>
    </View>
  </View>
</Modal>
<Modal visible={delayModalVisible} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.label}>Reason for Delay:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter reason..."
        value={delayReasonInput}
        onChangeText={setDelayReasonInput}
      />
      <Text style={styles.label}>New Due Date:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 28 Jul 2025"
        value={delayNewDate}
        onChangeText={setDelayNewDate}
      />

      <View style={styles.modalActions}>
        <Button title="Cancel" onPress={() => setDelayModalVisible(false)} />
        <Button title="Save" onPress={handleDelayTask} />
      </View>
    </View>
  </View>
</Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0B1A2F',
        padding: 20,
        paddingTop:40,
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
    },
    subheading: {
        fontSize: 16,
        color: '#FFD700',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: '700',
        color: '#90CAF9',
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        backgroundColor: '#1F3B60',
        color: '#fff',
        padding: 20,
        borderRadius: 5,
        minHeight: 50,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'white'
    },
    noComments: {
        color: '#ccc',
        fontStyle: 'italic',
        marginBottom: 10,
    },
    commentItem: {
        backgroundColor: '#1C1C1E',
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
    },
    commentTag: {
        color: '#FFD700',
        fontWeight: '700',
        fontSize: 12,
        marginBottom: 4,
    },
    commentText: {
        color: '#fff',
        marginBottom: 4,
    },
    previewImage: {
        width: '100%',
        height: 150,
        borderRadius: 6,
        marginTop: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#1F3B60',
        padding: 20,
        borderRadius: 10,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },
    tag: {
        backgroundColor: '#333',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedTag: {
        backgroundColor: '#FFD700',
    },
    tagText: {
        color: '#fff',
        fontWeight: '600',
        // textTransform: 'capitalize',
    },
    addButton: {
        backgroundColor: '#00B0FF',
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
