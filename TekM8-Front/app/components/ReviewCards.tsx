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
import * as Print from 'expo-print';
import { WebView } from 'react-native-webview';

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

type UploadedDoc = {
  name: string;
  uri: string;
};

export default function ReviewCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardResult | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

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

    const loadUploadedDocs = async () => {
      try {
        const stored = await AsyncStorage.getItem('uploadedDocs');
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log('✅ Loaded uploadedDocs:', parsed);
          setUploadedDocs(parsed);
        } else {
          console.log('⚠️ No uploadedDocs found in AsyncStorage');
        }
      } catch (error) {
        console.log('❌ Error loading uploadedDocs:', error);
        Alert.alert('Error', 'Failed to load uploaded documents');
      }
    };

    loadCards();
    loadUploadedDocs();
  }, []);

  const handleConvertByName = async (docName: string) => {
    const doc = uploadedDocs.find((d) => d.name === docName);
    if (!doc?.uri) {
      return Alert.alert('Not Found', `${docName} not found in saved documents.`);
    }

    try {
      const html = `
        <html>
          <body style="margin:0;padding:0;">
            <img src="${doc.uri}" style="width:100%;height:auto;" />
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      console.log('✅ PDF generated at:', uri);
      setPdfUri(uri);
      setPdfModalVisible(true);
    } catch (error) {
      console.log('❌ PDF generation failed:', error);
      Alert.alert('Error', 'Could not convert image to PDF.');
    }
  };

  const closePdfModal = () => {
    setPdfModalVisible(false);
    setPdfUri(null);
  };

  const closeCardModal = () => {
    setSelectedCard(null);
  };

  return (
    <View style={styles.container}>
      {cards.length === 0 ? (
        <Text style={styles.noCards}>No cards saved.</Text>
      ) : (
        <ScrollView>
          {cards.map((card, idx) => (
            <View key={idx} style={styles.cardContainer}>
              <TouchableOpacity
                onPress={() => setSelectedCard(card.result!)}
                style={styles.cardRow}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.underlinedText}>
                    {card.result?.front.name || `Card ${idx + 1}`}
                  </Text>
                  <Text>✅</Text>
                </View>
              </TouchableOpacity>
              
              {/* PDF Links directly under each card */}
              <View style={styles.pdfLinksContainer}>
                <TouchableOpacity 
                  onPress={() => handleConvertByName('PPE Sheet')}
                  style={styles.pdfLinkButton}
                >
                  <Text style={styles.pdfLinkText}>PPE Sheet</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => handleConvertByName('Induction checklist')}
                  style={styles.pdfLinkButton}
                >
                  <Text style={styles.pdfLinkText}>Induction Checklist</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Card Details Modal */}
      <Modal visible={!!selectedCard} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Card Details</Text>

              <Text style={styles.label}>👤 Name:</Text>
              <Text style={styles.value}>{selectedCard?.front.name}</Text>

              <Text style={styles.label}>🔢 Registration #:</Text>
              <Text style={styles.value}>
                {selectedCard?.front.registrationNumber}
              </Text>

              <Text style={styles.label}>📅 Expiry:</Text>
              <Text style={styles.value}>{selectedCard?.front.expiryDate}</Text>

              <Text style={styles.label}>🎓 Qualification:</Text>
              <Text style={styles.value}>
                {selectedCard?.back.qualification}
              </Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeCardModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* PDF Viewer Modal */}
      <Modal visible={pdfModalVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          {pdfUri ? (
            <WebView
              source={{ uri: pdfUri }}
              style={{ flex: 1 }}
              originWhitelist={['*']}
              onError={(e) => console.log('WebView error:', e.nativeEvent)}
            />
          ) : (
            <Text style={{ color: 'white', textAlign: 'center', marginTop: 50 }}>
              Loading PDF...
            </Text>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: '#0A84FF',
              padding: 15,
              alignItems: 'center',
            }}
            onPress={closePdfModal}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Close PDF</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F3B60',
    
    flex: 1,
    // padding: 20,
  },
  noCards: {
    fontSize: 16,
    color: '#7FB3D5',
  },
  cardContainer: {
    marginTop: 10,
    backgroundColor: '#2A4A6B',
    // backgroundColor: '#2A4A6B',
    // borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  cardRow: {
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  underlinedText: {
    fontSize: 18,
    color: 'white',
    textDecorationLine: 'underline',
    marginBottom: 0,
    fontWeight: '500',
  },
  pdfLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ffffff20',
  },
  pdfLinkButton: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  pdfLinkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
    textAlign: 'left',
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