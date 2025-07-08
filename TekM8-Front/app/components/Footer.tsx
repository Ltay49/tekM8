import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

export default function Footer({ navigation }: any) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.iconButton}>
        <MaterialIcons name="home" size={24} color="#ffffff" />
        <Text style={styles.iconLabel}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton}>
        <Feather name="users" size={24} color="#ffffff" />
        <Text style={styles.iconLabel}>Directory</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton}>
        <MaterialIcons name="how-to-reg" size={24} color="#ffffff" />
        <Text style={styles.iconLabel}>Induct</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="document-text-outline" size={24} color="#ffffff" />
        <Text style={styles.iconLabel}>Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton}>
        <Feather name="settings" size={24} color="#ffffff" />
        <Text style={styles.iconLabel}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1C1C1E',
    paddingVertical: 15,
    borderTopColor: '#ffffff33',
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.9,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconLabel: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 2,
  },
});
