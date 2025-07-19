import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import ViewShot, { captureRef } from 'react-native-view-shot';


const screenWidth = Dimensions.get('window').width;
const A4_WIDTH = screenWidth - 40;

const chartConfig = {
  backgroundGradientFrom: '#0B1A2F',
  backgroundGradientTo: '#0B1A2F',
  color: (opacity = 1) => `rgba(102, 178, 255, ${opacity})`,
  labelColor: () => '#fff',
};

export default function FormatReportScreen() {
  const { id, tag } = useLocalSearchParams<{ id: string; tag: string }>();
  const router = useRouter();

  const [entries, setEntries] = useState<any[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [showChart, setShowChart] = useState(true);
  const storageKey = `labour-entries-${id}`;

  const chartRef = useRef(null);

  const handleGeneratePDF = async () => {
    try {
      if (!chartRef.current) {
        alert('Chart is not ready yet.');
        return;
      }
  
      const chartUri = await captureRef(chartRef, {
        format: 'png',
        quality: 1,
        result: 'base64',
      });
  
      const chartImgHtml = showChart
        ? `<div class="chart"><h2>Task Distribution</h2><img src="data:image/png;base64,${chartUri}" style="width:100%; max-width:500px;" /></div>`
        : '';
  
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial; padding: 20px; }
              h1 { text-align: center; }
              .entry { margin-bottom: 12px; }
              .entry p { margin: 2px 0; }
              .chart { text-align: center; margin-top: 30px; }
            </style>
          </head>
          <body>
            <h1>${tag || 'Site Report'}</h1>
            <h2>Entries:</h2>
            ${entries.map(entry => `
              <div class="entry">
                <p><strong>Area:</strong> ${entry.area}</p>
                ${entry.area !== 'Site wide' ? `<p><strong>Level:</strong> ${entry.level}</p>` : ''}
                <p><strong>Trade:</strong> ${entry.trade}</p>
                <p><strong>Task:</strong> ${entry.task}</p>
                <p><strong>Number:</strong> ${entry.number}</p>
              </div>
            `).join('')}
            ${chartImgHtml}
          </body>
        </html>
      `;
  
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
  
      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri);
      } else {
        alert('PDF created but sharing is not available.');
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF.');
    }
  };
  

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored) setEntries(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load entries:', error);
      }
    };
    loadEntries();
  }, [id]);

  const taskCounts = entries.reduce((acc: any, entry) => {
    acc[entry.task] = (acc[entry.task] || 0) + Number(entry.number || 0);
    return acc;
  }, {});

  const pieData = Object.keys(taskCounts).map((key, index) => ({
    name: key,
    population: taskCounts[key],
    color: `hsl(${(index * 60) % 360}, 70%, 60%)`,
    legendFontColor: '#fff',
    legendFontSize: 12,
  }));

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back to Report</Text>
      </TouchableOpacity>

      {/* A4 Preview Container */}
      <View style={styles.a4}>
        <Text style={styles.title}>Report Preview: {tag}</Text>

        {/* Toggles */}
        <View style={styles.toggleContainer}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Report</Text>
            <Switch value={showGrid} onValueChange={setShowGrid} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Chart</Text>
            <Switch value={showChart} onValueChange={setShowChart} />
          </View>
        </View>

        {/* Grid Section */}
        {showGrid && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Grid Report</Text>
            {entries.map((entry, index) => (
              <View key={index} style={styles.gridItem}>
                <Text style={styles.gridText}>Area: {entry.area}</Text>
                {entry.area !== 'Site wide' && (
                  <Text style={styles.gridText}>Level: {entry.level}</Text>
                )}
                <Text style={styles.gridText}>Trade: {entry.trade}</Text>
                <Text style={styles.gridText}>Task: {entry.task}</Text>
                <Text style={styles.gridText}>Number: {entry.number}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Pie Chart Section */}
        {showChart && pieData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Task Distribution</Text>
            <ViewShot ref={chartRef} options={{ format: 'png', quality: 1 }}>
              <PieChart
                data={pieData}
                width={A4_WIDTH - 20}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="10"
                absolute
              />
            </ViewShot>

          </View>
        )}
        <TouchableOpacity onPress={handleGeneratePDF} style={styles.pdfButton}>
          <Text style={styles.pdfButtonText}>Export PDF</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#0B1A2F',
    paddingVertical: 50,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
  },
  backText: {
    color: '#66B2FF',
    fontSize: 16,
  },
  a4: {
    backgroundColor: '#16263D',
    width: screenWidth - 40,
    borderRadius: 0,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    color: '#ccc',
    fontSize: 15,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#66B2FF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  gridItem: {
    backgroundColor: '#1F3B60',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  gridText: {
    color: '#fff',
    fontSize: 14,
  },
  pdfButton: {
    backgroundColor: '#66B2FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 40,
    width: '60%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  pdfButtonText: {
    color: '#0B1A2F',
    fontSize: 16,
    fontWeight: 'bold',
  },

});
