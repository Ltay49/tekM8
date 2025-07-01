import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

// Enable layout animation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HowToOnBoard() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const instructions = [
    'Upload construction card',
    'Wait for review where we check validity',
    'Once checks confirmed, press Compose which will attach each inductee with your documentation',
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Text style={styles.title}>How to Onboard</Text>
        <AntDesign name={expanded ? 'up' : 'down'} size={20} color="#555" />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {instructions.map((item, index) => (
            <Text key={index} style={styles.step}>
              {index + 1}. {item}
            </Text>
          ))}
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
});
