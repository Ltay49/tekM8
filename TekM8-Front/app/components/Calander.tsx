import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';

type CalanderProps = {
    onDateSelect: (date: string) => void; // ✅ add this prop type
  };
  
  export default function Calander({ onDateSelect }: CalanderProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
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

  const handleDateClick = (date: Date) => {
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

  const navigateMonth = (direction: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const applyDateRange = () => {
    if (startDate && endDate) {
      const formatted = `${formatDate(startDate)} - ${formatDate(endDate)}`;
      onDateSelect(formatted);
    } else if (startDate) {
      const formatted = formatDate(startDate);
      onDateSelect(formatted);
    }
    setShowDatePicker(false);
  };

  const days = getDaysInMonth(currentMonth);

  const renderCalendarDay = (date: Date | null, index: number) => {
    if (!date) return <View key={index} style={styles.emptyDay} />;
    const isSelected =
      (startDate && date.getTime() === startDate.getTime()) ||
      (endDate && date.getTime() === endDate.getTime());
    const isInRange = isDateInRange(date);
    const isToday = date.toDateString() === new Date().toDateString();

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleDateClick(date)}
        style={[styles.calendarDay,
          isSelected && styles.selectedDay,
          isInRange && styles.rangeDay,
          isToday && styles.todayDay]}
      >
        <Text style={styles.calendarDayText}>{date.getDate()}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerText}>Due Date</Text>
      </TouchableOpacity>

      <Modal visible={showDatePicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.navButton}>
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.monthTitle}>
                {currentMonth.toLocaleDateString('en-GB', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
              <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.navButton}>
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weekRow}>
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
                <View key={i} style={styles.weekDay}>
                  <Text style={styles.weekDayText}>{d}</Text>
                </View>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
                <View key={weekIndex} style={styles.weekRow}>
                  {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((date, i) =>
                    renderCalendarDay(date, weekIndex * 7 + i)
                  )}
                </View>
              ))}
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity onPress={clearDates} style={styles.clearActionButton}>
                <Text style={styles.clearActionText}>Clear</Text>
              </TouchableOpacity>
              <View style={styles.actionButtonsRight}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={applyDateRange}
                  disabled={!startDate || !endDate}
                  style={[styles.applyButton, (!startDate || !endDate) && styles.applyButtonDisabled]}
                >
                  <Text
                    style={[styles.applyButtonText, (!startDate || !endDate) && styles.applyButtonTextDisabled]}
                  >
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#0B1A2F',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'white',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: { padding: 10 },
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
    marginBottom: 6,
  },
  weekDay: {
    width: 40,
    alignItems: 'center',
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'white',
    paddingTop: 15,
  },
  clearActionButton: { padding: 10 },
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
  datePickerButton: {
    padding: 12,
    backgroundColor: '#0B1A2F',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  datePickerText: {
    color: 'white',
    fontSize: 16,
  },
});