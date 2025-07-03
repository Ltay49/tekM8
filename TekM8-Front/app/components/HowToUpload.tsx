import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

// Enable layout animation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HowToUpload() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const instructions = [
    'Tap "Upload Documents" to select files.',
    'Review and delete any unwanted documents.',
    'Press "Save" to store documents permanently.',
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Text style={styles.title}>How to Upload</Text>
        <AntDesign name={expanded ? 'up' : 'down'} size={20} color="#555" />
      </TouchableOpacity>

      {expanded && (
     <View style={styles.content}>
     {instructions.map((item, index) => (
       <View key={index} style={styles.stepRow}>
         <View style={styles.numberCircle}>
           <Text style={styles.numberText}>{index + 1}</Text>
         </View>
         <Text style={styles.step}>{item}</Text>
       </View>
     ))}
     <Text style={styles.note}>
       Please make sure your documents are clear and well-lit for best results.
     </Text>
   </View>
   
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F7FA',
    borderRadius: 10,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    marginTop: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  numberCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  
  numberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Montserrat_400Regular',
  },
  step: {
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  
  note: {
    marginTop: 12,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
  },
});
