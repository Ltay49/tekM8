import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Pressable,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Card = {
  front: string | null;
  back: string | null;
  result?: {
    front: {
      rawText: string;
      name: string | null;
      registrationNumber: string | null;
      expiryDate: string | null;
    };
    back: {
      rawText: string;
      qualification: string | null;
    };
  };
};

export default function UploadCSCSCards() {
  const [cards, setCards] = useState<Card[]>([{ front: null, back: null }]);
  const [confirmedCards, setConfirmedCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const requestPermissions = async () => {
    const camera = await ImagePicker.requestCameraPermissionsAsync();
    const media = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return camera.status === 'granted' && media.status === 'granted';
  };

  const scanSide = async (index: number, side: 'front' | 'back') => {
    const granted = await requestPermissions();
    if (!granted) return Alert.alert('Permission required');

    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;

      setCards(prev => {
        const updated = [...prev];
        updated[index][side] = uri;

        const card = updated[index];
        if (card.front && card.back) {
          extractCardDetails(card.front, card.back, index);
        }

        const isLast = index === updated.length - 1;
        if (card.front && card.back && isLast) {
          updated.push({ front: null, back: null });
        }

        return updated;
      });
    }
  };

  const extractCardDetails = async (frontUri: string, backUri: string, index: number) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('frontImage', {
        uri: frontUri,
        name: 'front.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('backImage', {
        uri: backUri,
        name: 'back.jpg',
        type: 'image/jpeg',
      } as any);

      const res = await fetch('http://192.168.0.37:3000/vision/extract', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await res.json();
      console.log('🧠 Extracted CSCS Card Details:', data);

      setCards(prev => {
        const updated = [...prev];
        updated[index].result = data;
        return updated;
      });
    } catch (error) {
      console.error('❌ Failed to extract card details:', error);
      Alert.alert('Error', 'Failed to read card');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAll = async () => {
    const completeCards = cards.filter(c => c.front && c.back && c.result);

    if (completeCards.length === 0) {
      Alert.alert('No complete cards', 'Please scan both sides of a card before confirming.');
      return;
    }

    try {
      console.log('📝 Saving these cards to AsyncStorage:\n', JSON.stringify(completeCards, null, 2));
      await AsyncStorage.setItem('scannedCSCSCards', JSON.stringify(completeCards));
      setConfirmedCards(completeCards);
      Alert.alert('✅ Confirmed', `${completeCards.length} card(s) confirmed and saved.`);
      setCards([{ front: null, back: null }]); // reset scanner
    } catch (err) {
      console.error('❌ Failed to save cards:', err);
      Alert.alert('Save Error', 'Failed to save CSCS card data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan CSCS Card</Text>

      {cards.map((card, index) => (
        <View key={index} style={styles.thumbnailRow}>
          <Pressable style={styles.thumbnailWrapper} onPress={() => scanSide(index, 'front')}>
            {card.front ? (
              <>
                <Image source={{ uri: card.front }} style={styles.thumbnail} />
                <Pressable style={styles.labelOverlay} onPress={() => setPreviewUri(card.front!)}>
                  <Text style={styles.labelText}>Front</Text>
                </Pressable>
              </>
            ) : (
              <Text style={styles.placeholder}>Tap to Scan Front</Text>
            )}
          </Pressable>

          <Pressable style={styles.thumbnailWrapper} onPress={() => scanSide(index, 'back')}>
            {card.back ? (
              <>
                <Image source={{ uri: card.back }} style={styles.thumbnail} />
                <Pressable style={styles.labelOverlay} onPress={() => setPreviewUri(card.back!)}>
                  <Text style={styles.labelText}>Back</Text>
                </Pressable>
              </>
            ) : (
              <Text style={styles.placeholder}>Tap to Scan Back</Text>
            )}
          </Pressable>
        </View>
      ))}

      {isLoading && <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />}

      {cards.filter(c => c.front && c.back && c.result).length > 0 && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmAll}>
          <Text style={styles.confirmText}>Confirm All</Text>
        </TouchableOpacity>
      )}

      <Modal visible={!!previewUri} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setPreviewUri(null)}>
          {previewUri && <Image source={{ uri: previewUri }} style={styles.fullscreenImage} />}
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  thumbnailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  thumbnailWrapper: {
    width: '48%',
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'relative',
  },
  thumbnail: { width: '100%', height: '100%', borderRadius: 10 },
  placeholder: { color: '#aaa', textAlign: 'center' },
  confirmButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cardsHeader: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  labelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  labelText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '90%',
    height: '80%',
    borderRadius: 10,
    resizeMode: 'contain',
  },
});
