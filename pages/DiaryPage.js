import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal, TextInput } from 'react-native';
import axios from 'axios';
import Timeline from 'react-native-timeline-flatlist';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SERVER_URL } from '../constants';

export default function DiaryPage() {
  const [timelineData, setTimelineData] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [turnCount, setTurnCount] = useState('');
  const [isStartTimePicker, setIsStartTimePicker] = useState(false);


  useEffect(() => {
    fetchTimelineData();
  }, []);

  const fetchTimelineData = async () => {
    try {
      const userId = 1;
      const response = await axios.get(`${SERVER_URL}/user/get/sleeptime/userId/${userId}`);
      const responseData = response.data.data;

      const timelineData = responseData.map((item) => {
        const startDate = new Date(item.startT);
        const endDate = new Date(item.endT);

        // UTC 시간을 한국 시간으로 변환
        const koreaOffset = 9 * 60 * 60 * 1000; // 한국 시간대의 UTC 오프셋 (9시간)
        const koreaStartDate = new Date(startDate.getTime() + koreaOffset);
        const koreaEndDate = new Date(endDate.getTime() + koreaOffset);

        // 시작 시간이 속한 날짜로 수면 이벤트를 표시
        const sleepDate = koreaStartDate.toDateString();
        const sleepDuration = calculateSleepDuration(startDate, endDate);

        const sleepTimeText = `수면 시간: ${sleepDuration}`;
        const startDateTimeText = `시작 시간: ${koreaStartDate.toLocaleTimeString('ko-KR')}`; // 수정된 부분
        const endDateTimeText = `종료 시간: ${koreaEndDate.toLocaleTimeString('ko-KR')}`; // 수정된 부분
        const turnCountText = `뒤집기한 횟수: ${item.turn_cnt || ''}`; // 추가된 부분

        return {
          time: sleepDate,
          title: '',
          description: `${sleepTimeText}\n${startDateTimeText}\n${endDateTimeText}\n${turnCountText}`, // 수정된 부분
          endTime: koreaEndDate.toDateString(),
          turnCount: item.turn_cnt || '',
          id: item.id, // 삭제 버튼을 위한 식별자 추가
        };
      });

      const sortedTimelineData = timelineData.sort((a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        return dateA - dateB;
      });

      setTimelineData(sortedTimelineData);
    } catch (error) {
      console.error(error);
    }
  };


  const calculateSleepDuration = (start, end) => {
    const startDate = new Date(start); // 시작 날짜와 시간을 Date 객체로 변환
    const endDate = new Date(end); // 종료 날짜와 시간을 Date 객체로 변환

    // 날짜 정보 제거하고 시간 계산
    const duration = Math.abs(endDate.getTime() - startDate.getTime());
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);

    return `${hours} 시간 ${minutes} 분 ${seconds} 초`;
  };


  const handleDeleteTimelineItem = async (id) => {
    try {
      await axios.delete(`${SERVER_URL}/sleepTime/delete/sleepTimeId/${id}`);
      await fetchTimelineData();
    } catch (error) {
      console.error(error);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
    setShowTimePicker(false);
  };

  const showTimePickerModal = (isStartTime) => {
    setShowDatePicker(false);
    setShowTimePicker(true);
    setIsStartTimePicker(isStartTime); // isStartTimePicker 변수 추가
  };

  const handleStartDateChange = (event, selected) => {
    const currentDate = selected || selectedStartDate;
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedStartDate(currentDate);

    // 시간 선택 팝업이 열려있을 경우에는 시간 선택 팝업을 닫음
    if (showTimePicker) {
      setShowTimePicker(false);
    }
  };

  const handleStartTimeChange = (event, selected) => {
    const currentTime = selected || selectedStartTime;
    setShowTimePicker(Platform.OS === 'ios');
    setSelectedStartTime(currentTime);

    // 날짜 선택 팝업이 열려있을 경우에는 날짜 선택 팝업을 닫음
    if (showDatePicker) {
      setShowDatePicker(false);
    }
  };

  const handleEndDateChange = (event, selected) => {
    const currentDate = selected || selectedEndDate;
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedEndDate(currentDate);

    // 시간 선택 팝업이 열려있을 경우에는 시간 선택 팝업을 닫음
    if (showTimePicker) {
      setShowTimePicker(false);
    }
  };

  const handleEndTimeChange = (event, selected) => {
    const currentTime = selected || selectedEndTime;
    setShowTimePicker(Platform.OS === 'ios');
    setSelectedEndTime(currentTime);

    // 날짜 선택 팝업이 열려있을 경우에는 날짜 선택 팝업을 닫음
    if (showDatePicker) {
      setShowDatePicker(false);
    }
  };

  const createSleepTime = async () => {
    try {
      const userId = 1;
      const startDate = selectedStartDate;
      const startTime = selectedStartTime;
      const endDate = selectedEndDate;
      const endTime = selectedEndTime;

      const startDateTime = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        startTime.getHours(),
        startTime.getMinutes(),
        startTime.getSeconds()
      );

      const endDateTime = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        endTime.getHours(),
        endTime.getMinutes(),
        endTime.getSeconds()
      );

      const sleepTimeData = {
        userId: userId,
        startT: startDateTime.toISOString(),
        endT: endDateTime.toISOString(),
        turnCount: turnCount,
      };

      await axios.post(`${SERVER_URL}/sleepTime/create/userId/${userId}`, sleepTimeData);
      await fetchTimelineData();
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Text style={styles.addButtonText}>Add Sleep Time</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.pickerButton} onPress={showDatePickerModal}>
              <Text style={styles.pickerButtonText}>Pick Start Date</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pickerButton} onPress={() => showTimePickerModal(true)}>
              <Text style={styles.pickerButtonText}>Pick Start Time</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedStartDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            )}

            {showTimePicker && isStartTimePicker && (
              <DateTimePicker
                value={selectedStartTime}
                mode="time"
                display="default"
                onChange={handleStartTimeChange}
              />
            )}

            <TouchableOpacity style={styles.pickerButton} onPress={showDatePickerModal}>
              <Text style={styles.pickerButtonText}>Pick End Date</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pickerButton} onPress={() => showTimePickerModal(false)}>
              <Text style={styles.pickerButtonText}>Pick End Time</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedEndDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
            )}

            {showTimePicker && !isStartTimePicker && (
              <DateTimePicker
                value={selectedEndTime}
                mode="time"
                display="default"
                onChange={handleEndTimeChange}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Turn Count"
              onChangeText={setTurnCount}
              value={turnCount}
            />

            <TouchableOpacity style={styles.confirmButton} onPress={createSleepTime}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Timeline
        data={timelineData}
        circleSize={15}
        circleColor="#a1dfff"
        lineColor="#808080"
        timeContainerStyle={{ width: 113, height: 25, borderRadius: 25, backgroundColor: '#45bcff' }}
        timeStyle={styles.time}
        descriptionStyle={styles.description}
        options={{
          style: { paddingTop: 10 },
        }}
        title={() => null} // 타임라인 제목을 제거하는 부분
        renderDetail={(rowData, sectionID, rowID) => (
          <View style={styles.timelineItem}>
            <Text style={styles.description}>{rowData.description}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteTimelineItem(rowData.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  addButton: {
    marginBottom: 16,
    alignSelf: 'flex-start',
    backgroundColor: '#73c8ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  timeContainer: {
    minWidth: 50,
    height: 35,
    backgroundColor: '#45bcff',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'normal',
    padding: 3,
  },
  description: {
    color: 'black',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#CCCCCC',
    padding: 5,
    borderRadius: 3,
  },
  deleteButtonText: {
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 5,
    width: '80%',
  },
  pickerButton: {
    marginBottom: 16,
    backgroundColor: '#ff9797',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  pickerButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#ff9797',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 16,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#808080',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#808080',
  },
});
