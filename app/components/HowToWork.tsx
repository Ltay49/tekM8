import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // optional for icons

// Enable layout animation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HowToWork() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Text style={styles.title}>How to Work</Text>
        <AntDesign name={expanded ? 'up' : 'down'} size={20} color="#555" />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <Text style={styles.step}>
            1. Upload your onboarding documentation{'\n'}e.g. Induction checklist and PPE sheet
          </Text>
          <Text style={styles.step}>
            2. Use the camera or upload photos of your CITB construction cards
          </Text>
          <Text style={styles.step}>
            3. We'll extract your details using Google Vision API
          </Text>
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
    backgroundColor: '#f5f5f7',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    marginTop: 12,
  },
  step: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
    lineHeight: 22,
  },
  note: {
    marginTop: 12,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
  },
});
