import React, { useState } from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface ChartData {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

const workforceData: ChartData[] = [
    { name: 'Plasterer', population: 8, color: '#f39c12', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Fixer', population: 6, color: '#e74c3c', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Labourer', population: 18, color: '#2ecc71', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Management', population: 10, color: '#3498db', legendFontColor: '#7F7F7F', legendFontSize: 15 },
];

const skillsData: ChartData[] = [
    { name: 'IPAF', population: 12, color: '#9b59b6', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'PASMA', population: 10, color: '#1abc9c', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'First Aid', population: 8, color: '#e67e22', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'SSSTS', population: 7, color: '#34495e', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'SMSTS', population: 5, color: '#95a5a6', legendFontColor: '#7F7F7F', legendFontSize: 15 },
];

const areaData: ChartData[] = [
    { name: 'GF', population: 10, color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Level 01', population: 9, color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Level 02', population: 8, color: '#FFCE56', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Level 03', population: 5, color: '#4BC0C0', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Roof', population: 4, color: '#9966FF', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Site Wide', population: 6, color: '#C9CBCF', legendFontColor: '#7F7F7F', legendFontSize: 15 },
];

const taskData: ChartData[] = [
    { name: '1st Fixing', population: 10, color: '#f1c40f', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: '2nd Fixing', population: 9, color: '#2ecc71', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Plastering', population: 8, color: '#3498db', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Snagging', population: 5, color: '#9b59b6', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'M&E Install', population: 6, color: '#34495e', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Decorating', population: 4, color: '#e67e22', legendFontColor: '#7F7F7F', legendFontSize: 15 },
];

type ChartType = 'workforce' | 'skills' | 'area' | 'task';

const PieChartComponent: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<ChartType>('workforce');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [visibleCharts, setVisibleCharts] = useState<ChartType[]>(['workforce', 'skills', 'area', 'task']);

  const chartMap: Record<ChartType, ChartData[]> = {
    workforce: workforceData,
    skills: skillsData,
    area: areaData,
    task: taskData,
  };

  const chartTitleMap: Record<ChartType, string> = {
    workforce: 'Workforce Split',
    skills: 'Skills Split',
    area: 'Most Active Areas',
    task: 'Tasks Breakdown',
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDisplayText = (): string => {
    if (!startDate && !endDate) return 'Select Date Range';
    if (startDate && !endDate) return `${formatDate(startDate)} - Select end`;
    if (startDate && endDate) return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    return 'Select Date Range';
  };

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateInRange = (date: Date | null): boolean => {
    if (!startDate || !endDate || !date) return false;
    return date >= startDate && date <= endDate;
  };

  const handleDateClick = (date: Date): void => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date >= startDate) {
        setEndDate(date);
      } else {
        setStartDate(date);
        setEndDate(startDate);
      }
    }
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const clearDates = (): void => {
    setStartDate(null);
    setEndDate(null);
  };

  const toggleChartVisibility = (chartType: ChartType): void => {
    setVisibleCharts(prev => {
      if (prev.includes(chartType)) {
        // Don't allow removing if it's the only visible chart
        if (prev.length === 1) return prev;
        const newVisible = prev.filter(chart => chart !== chartType);
        // If the currently selected chart is being hidden, switch to the first visible one
        if (selectedChart === chartType && newVisible.length > 0) {
          setSelectedChart(newVisible[0]);
        }
        return newVisible;
      } else {
        return [...prev, chartType];
      }
    });
  };

  const applyChartSelection = (): void => {
    setShowAddModal(false);
  };

  const applyDateRange = (): void => {
    console.log('Date range applied:', { startDate, endDate });
    setShowDatePicker(false);
  };

  const renderCalendarDay = (date: Date | null, index: number): React.ReactElement => {
    if (!date) {
      return <View key={index} style={styles.emptyDay} />;
    }

    const isSelected = (startDate && date.getTime() === startDate.getTime()) ||
                     (endDate && date.getTime() === endDate.getTime());
    const isInRange = isDateInRange(date);
    const isToday = date.toDateString() === new Date().toDateString();

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleDateClick(date)}
        style={[
          styles.calendarDay,
          isSelected && styles.selectedDay,
          isInRange && !isSelected && styles.rangeDay,
          isToday && !isSelected && styles.todayDay,
        ]}
      >
        <Text style={[
          styles.calendarDayText,
          isSelected && styles.selectedDayText,
          isInRange && !isSelected && styles.rangeDayText,
        ]}>
          {date.getDate()}
        </Text>
      </TouchableOpacity>
    );
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <View style={styles.container}>
      {/* Date Range Picker and Add Button Row */}
      <View style={styles.topButtonRow}>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerText}>📅</Text>
          <Text style={styles.datePickerLabel}>{getDisplayText()}</Text>
          {(startDate || endDate) && (
            <TouchableOpacity
              onPress={clearDates}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Toggle Buttons */}
      <View style={styles.toggleRow}>
        {visibleCharts.map((type: ChartType) => (
          <TouchableOpacity
            key={type}
            style={[styles.toggleButton, selectedChart === type && styles.activeButton]}
            onPress={() => setSelectedChart(type)}
          >
            <Text style={[styles.toggleText, selectedChart === type && styles.activeText]}>
              {chartTitleMap[type]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart Title */}
      <Text style={styles.title}>{chartTitleMap[selectedChart]}</Text>

      {/* Pie Chart */}
      <PieChart
        data={chartMap[selectedChart]}
        width={screenWidth}
        height={220}
        chartConfig={{
          color: () => '#000',
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="0"
        absolute
      />

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                onPress={() => navigateMonth(-1)}
                style={styles.navButton}
              >
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.monthTitle}>{monthYear}</Text>
              <TouchableOpacity
                onPress={() => navigateMonth(1)}
                style={styles.navButton}
              >
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Days of Week */}
            <View style={styles.weekRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day: string) => (
                <View key={day} style={styles.weekDay}>
                  <Text style={styles.weekDayText}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {Array.from({ length: Math.ceil(days.length / 7) }, (_: unknown, weekIndex: number) => (
                <View key={weekIndex} style={styles.weekRow}>
                  {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((date: Date | null, dayIndex: number) =>
                    renderCalendarDay(date, weekIndex * 7 + dayIndex)
                  )}
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={clearDates}
                style={styles.clearActionButton}
              >
                <Text style={styles.clearActionText}>Clear</Text>
              </TouchableOpacity>
              <View style={styles.actionButtonsRight}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={applyDateRange}
                  disabled={!startDate || !endDate}
                  style={[
                    styles.applyButton,
                    (!startDate || !endDate) && styles.applyButtonDisabled
                  ]}
                >
                  <Text style={[
                    styles.applyButtonText,
                    (!startDate || !endDate) && styles.applyButtonTextDisabled
                  ]}>
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Data Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addModalContent}>
            <Text style={styles.addModalTitle}>Select Data to Display</Text>
            <Text style={styles.addModalSubtitle}>Choose which charts you want to show</Text>
            
            <View style={styles.chartOptionsContainer}>
              {(['workforce', 'skills', 'area', 'task'] as const).map((chartType: ChartType) => (
                <TouchableOpacity
                  key={chartType}
                  style={styles.chartOption}
                  onPress={() => toggleChartVisibility(chartType)}
                >
                  <View style={styles.chartOptionLeft}>
                    <View style={[
                      styles.checkbox,
                      visibleCharts.includes(chartType) && styles.checkboxChecked
                    ]}>
                      {visibleCharts.includes(chartType) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.chartOptionText}>{chartTitleMap[chartType]}</Text>
                  </View>
                  <Text style={styles.chartItemCount}>
                    {chartMap[chartType].length} items
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.addModalActions}>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.addModalCancelButton}
              >
                <Text style={styles.addModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyChartSelection}
                style={styles.addModalApplyButton}
              >
                <Text style={styles.addModalApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: 'white',
    marginBottom: 20,
    paddingBottom: 20,
  },
  topButtonRow: {
    flexDirection: 'row',
    margin: 10,
    marginBottom: 15,
    gap: 10,
  },
  datePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B1A2F',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    padding: 12,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  datePickerText: {
    fontSize: 18,
    marginRight: 10,
  },
  datePickerLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    color: '#7F7F7F',
    fontSize: 16,
  },
  title: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    margin: 5,
  },
  activeButton: {
    backgroundColor: 'white',
  },
  toggleText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 13,
  },
  activeText: {
    color: '#0B1A2F',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#0B1A2F',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    borderWidth: 1,
    borderColor: 'white',
    maxWidth: 350,
    width: '90%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  monthTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weekDay: {
    width: 40,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    color: '#7F7F7F',
    fontSize: 12,
    fontWeight: 'bold',
  },
  calendarGrid: {
    marginBottom: 20,
  },
  calendarDay: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  emptyDay: {
    width: 40,
    height: 40,
  },
  selectedDay: {
    backgroundColor: '#3498db',
  },
  rangeDay: {
    backgroundColor: 'rgba(52, 152, 219, 0.3)',
  },
  todayDay: {
    borderWidth: 1,
    borderColor: '#3498db',
  },
  calendarDayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: 'white',
  },
  rangeDayText: {
    color: '#3498db',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'white',
    paddingTop: 15,
  },
  clearActionButton: {
    padding: 10,
  },
  clearActionText: {
    color: '#7F7F7F',
    fontSize: 14,
  },
  actionButtonsRight: {
    flexDirection: 'row',
  },
  cancelButton: {
    padding: 10,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#7F7F7F',
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonDisabled: {
    backgroundColor: '#2c3e50',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  applyButtonTextDisabled: {
    color: '#7F7F7F',
  },
  // Add Modal Styles
  addModalContent: {
    backgroundColor: '#0B1A2F',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    borderWidth: 1,
    borderColor: 'white',
    maxWidth: 400,
    width: '90%',
  },
  addModalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  addModalSubtitle: {
    color: '#7F7F7F',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  chartOptionsContainer: {
    marginBottom: 20,
  },
  chartOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  chartOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chartOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  chartItemCount: {
    color: '#7F7F7F',
    fontSize: 12,
  },
  addModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'white',
    paddingTop: 15,
  },
  addModalCancelButton: {
    padding: 10,
  },
  addModalCancelText: {
    color: '#7F7F7F',
    fontSize: 16,
  },
  addModalApplyButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addModalApplyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PieChartComponent;