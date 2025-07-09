import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';

const { height, width } = Dimensions.get('window');

type Doc = {
  id: string;
  name: string;
  uri: string;
};

type Card = {
  front: string | null;
  back: string | null;
  result?: any;
};

export default function CSCSBundleFullScreenViewer() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedDocs = await AsyncStorage.getItem('uploadedDocs');
        const savedCards = await AsyncStorage.getItem('scannedCSCSCards');
        if (savedDocs) setDocs(JSON.parse(savedDocs));
        if (savedCards) setCards(JSON.parse(savedCards));
      } catch (err) {
        console.error('❌ Load error:', err);
      }
    };
    loadData();
  }, []);

  const openModal = (card: Card) => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  const sendBundleViaEmail = async () => {
    try {
      const attachments: string[] = [];

      // Add document URIs
      for (const doc of docs) {
        if (doc.uri.startsWith('file://')) {
          attachments.push(doc.uri);
        } else {
          const localUri = `${FileSystem.documentDirectory}${doc.name}`;
          await FileSystem.downloadAsync(doc.uri, localUri);
          attachments.push(localUri);
        }
      }

      // Add card image URIs
      for (const card of cards) {
        if (card.front) attachments.push(card.front);
        if (card.back) attachments.push(card.back);
      }

      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Mail service not available on this device');
        return;
      }

      await MailComposer.composeAsync({
        recipients: ['example@example.com'], // Change this to dynamic email if needed
        subject: 'CSCS Bundle Export',
        body: 'Please find the attached CSCS documents and cards.',
        attachments,
      });
    } catch (error) {
      console.error('❌ Email export error:', error);
      Alert.alert('Failed to export bundle.');
    }
  };

  return (
    <View style={styles.container}>
      {cards.map((card, i) => (
        <TouchableOpacity
          key={i}
          style={styles.cardItem}
          onPress={() => openModal(card)}
        >
          <Text style={styles.cardName}>
            {card.result?.front?.name || `Card ${i + 1}`}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.exportBtn} onPress={sendBundleViaEmail}>
        <Text style={styles.exportText}>Export via Email</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <ScrollView pagingEnabled showsVerticalScrollIndicator={false}>
          {docs.map((doc) => (
            <View key={doc.id} style={styles.page}>
              <Image source={{ uri: doc.uri }} style={styles.fullImage} />
            </View>
          ))}

          {selectedCard && (
            <View style={styles.page}>
              <View style={styles.cardImageRow}>
                {selectedCard.front && (
                  <Image source={{ uri: selectedCard.front }} style={styles.cardImage} />
                )}
                {selectedCard.back && (
                  <Image source={{ uri: selectedCard.back }} style={styles.cardImage} />
                )}
              </View>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#1F3B60',
    flex: 1,
  },
  cardItem: {
    padding: 10,
    marginBottom: 10,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '600',
    textDecorationLine: 'underline',
    color: 'white',
  },
  exportBtn: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#1C1C1E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth:1,
    borderColor: 'grey',
  },
  exportText: {
    color: '#00B0FF',
    fontWeight: '700',
  },
  page: {
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  fullImage: {
    height: height,
    width: width,
    resizeMode: 'contain',
  },
  cardImageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  cardImage: {
    width: width / 2 - 30,
    height: height * 0.7,
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
  closeBtn: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 10,
  },
  closeText: {
    color: 'white',
    fontWeight: '600',
  },
});

