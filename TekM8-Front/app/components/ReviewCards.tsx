import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CardResult = {
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

type Card = {
  front: string | null;
  back: string | null;
  result?: CardResult;
};

export default function ReviewCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardResult | null>(null);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const stored = await AsyncStorage.getItem('scannedCSCSCards');
        if (stored) {
          setCards(JSON.parse(stored));
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load cards');
      }
    };

    loadCards();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved CSCS Cards</Text>

      {cards.length === 0 ? (
        <Text style={styles.noCards}>No cards saved.</Text>
      ) : (
        cards.map((card, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setSelectedCard(card.result!)}
          >
            <Text style={styles.underlinedText}>
              {card.result?.front.name || `Card ${idx + 1}`}
            </Text>
          </TouchableOpacity>
        ))
      )}

      {/* Modal to show details */}
      <Modal visible={!!selectedCard} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Card Details</Text>

              <Text style={styles.label}>👤 Name:</Text>
              <Text style={styles.value}>{selectedCard?.front.name}</Text>

              <Text style={styles.label}>🔢 Registration #:</Text>
              <Text style={styles.value}>{selectedCard?.front.registrationNumber}</Text>

              <Text style={styles.label}>📅 Expiry:</Text>
              <Text style={styles.value}>{selectedCard?.front.expiryDate}</Text>

              <Text style={styles.label}>🎓 Qualification:</Text>
              <Text style={styles.value}>{selectedCard?.back.qualification}</Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedCard(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F3B60',
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  noCards: {
    fontSize: 16,
    color: '#7FB3D5',
  },
  underlinedText: {
    fontSize: 18,
    color: 'white',
    textDecorationLine: 'underline',
    marginBottom: 15,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#1F3B60',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#ffffff33',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#7FB3D5',
    marginTop: 12,
    marginBottom: 4,
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#0A84FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
