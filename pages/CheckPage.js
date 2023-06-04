import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Switch, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Slider from '@react-native-community/slider';
import MusicSelection from '../MusicSelection/musicselection.js'; // 실제 MusicSelection 컴포넌트의 경로로 수정해주세요
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Notifications from 'expo-notifications';

const headers = {
  'Accept': 'application/json',
  'X-M2M-RI': '12345',
  'X-M2M-Origin': 'cap',
  'Content-Type': 'application/vnd.onem2m-res+json; ty=3'
};
const url = 'http://203.253.128.177:7579/Mobius/CapstonDesign/Temp/la';

export default function CheckPage() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [lightValue, setLightValue] = useState(0);
  const [humidifierValue, setHumidifierValue] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState('music1');
  const [whiteNoisePlaying, setWhiteNoisePlaying] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(url, { headers });
      const content = response.data['m2m:cin'];
      if (content && content.con) {
        const [temperature, humidity, waterLevel] = content.con.split(',');
        setTemperature(Number(temperature));
        setHumidity(Number(humidity));
        if (Number(waterLevel) < 400) {
          showPushNotification(); // 수위가 400보다 작을 때 푸시 알림 표시
        }
      } else {
        console.log("There is no data to show.");
        setTemperature(0);
        setHumidity(0);
      }
    } catch (error) {
      console.log(`There was a problem: ${error}`);
      setTemperature(0);
      setHumidity(0);
    }
  };

  const showPushNotification = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Water Level Alert',
        body: 'The water level is below the threshold.',
      },
      trigger: null,
    });
  };

  const handleLightValueChange = (value) => {
    setLightValue(value);
    const LEDUrl = 'http://203.253.128.177:7579/Mobius/CapstonDesign/LED';

    let LEDCode;
    switch (value) {
      case 'on':
        LEDCode = '1';
        break;
      case 'off':
        LEDCode = '0';
        break;
      case 'red':
        LEDCode = '2';
        break;
      case 'yellow':
        LEDCode = '3';
        break;
      case 'blue':
        LEDCode = '4';
        break;
      default:
        LEDCode = '0';
    }

    const data = {
      "m2m:cin": {
        "con": LEDCode.toString()
      }
    };

    updateData(LEDUrl, data, 'LED');
  };

  const handleHumidifierValueChange = () => {
    setHumidifierValue(!humidifierValue);
    const value = humidifierValue ? '0' : '1';
    const humidifierUrl = 'http://203.253.128.177:7579/Mobius/CapstonDesign/State';
    
    const data = {
      "m2m:cin": {
        "con": value.toString()
      }
    };
    
    updateData(humidifierUrl, data, 'humidifier');
  };

  const handleWhiteNoiseSelected = (value, duration) => {
    setSelectedMusic(value);
    setTotalTime(duration);
    setCurrentTime(0);
  };

  const handleWhiteNoisePlaying = () => {
    setWhiteNoisePlaying(!whiteNoisePlaying);
    const value = whiteNoisePlaying ? '0' : '1';
    const whiteNoiseUrl = 'http://203.253.128.177:7579/Mobius/CapstonDesign/Song';

    const data = {
      "m2m:cin": {
        "con": value.toString()
      }
    };

    updateData(whiteNoiseUrl, data, 'white noise');
  };

  const updateData = (url, data, name) => {
    axios.request({
      method: 'post',
      url,
      headers,
      data
    })
      .then(response => {
        console.log(`${name} value updated successfully.`);
      })
      .catch(error => {
        console.log(`Error updating ${name} value:`, error);
      });
  };

  const handleSliderChange = (value) => {
    setCurrentTime(value);
  };

  const calculateProgressBarValue = (temperature) => {
    const minTemperature = 0.0; // 최소 온도
    const maxTemperature = 100.0; // 최대 온도
  
    // 온도 값을 프로그래스 바의 범위에 맞게 변환
    const ratio = (temperature - minTemperature) / (maxTemperature - minTemperature);
    const progressBarValue = ratio * 100;
  
    return progressBarValue;
  };


  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.sensorContainer}>
          <View style={styles.sensorTempBoxBox}>
            <View style={styles.sensorTempBox}>
              <View style={styles.sensorTemp}>
                <Text style={styles.title}>Temperature</Text>
              </View>
              <AnimatedCircularProgress
                size={180}
                width={10}
                // fill={temperature}
                fill={calculateProgressBarValue(temperature)}
                tintColor="#00e0ff"
                backgroundColor="#dcdcdc"
                lineCap="round"
                rotation={40}
                arcSweepAngle={280}
                style={{ transform: [{ scaleY: -1 }, {translateY: -15}] }}
                />
                <View style={styles.TempvalueContainer}>
                  <Text style={styles.value}>{temperature}°C</Text>
                </View>
            </View>
          </View>
          <View style={styles.sensorHumBoxBox}>
            <View style={styles.sensorHumBox}>
              <View style={styles.sensorHum}>
                <Text style={styles.title}>Humidity</Text>
              </View>
              <AnimatedCircularProgress
                size={180}
                width={10}
                fill={humidity}
                tintColor="#00e0ff"
                backgroundColor="#dcdcdc"
                lineCap="round"
                rotation={40}
                arcSweepAngle={280}
                style={{ transform: [{ scaleY: -1 }, { translateY: -15 }] }}
              />
              <View style={styles.HumvalueContainer}>
                <Text style={styles.value}>{humidity}%</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.controlContainer}>
          <View style={styles.controlLight}>
            <Text style={styles.controlTitle}>Light</Text>
            <View style={styles.buttonLight}>
              <TouchableOpacity
                style={[styles.controlLightButton, lightValue === 'on' && styles.activeControlButton]} // 선택된 상태에 따라 스타일 변경
                onPress={() => handleLightValueChange('on')}
              >
                <Text style={styles.controlLightButtonText}>On</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlLightButton, lightValue === 'off' && styles.activeControlButton]} // 선택된 상태에 따라 스타일 변경
                onPress={() => handleLightValueChange('off')}
              >
                <Text style={styles.controlLightButtonText}>Off</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlLightButton, lightValue === 'red' && styles.activeControlButton]} // 선택된 상태에 따라 스타일 변경
                onPress={() => handleLightValueChange('red')}
              >
                <Text style={styles.controlLightButtonText}>Red</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlLightButton, lightValue === 'yellow' && styles.activeControlButton]} // 선택된 상태에 따라 스타일 변경
                onPress={() => handleLightValueChange('yellow')}
              >
                <Text style={styles.controlLightButtonText}>Yellow</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlLightButton, lightValue === 'blue' && styles.activeControlButton]} // 선택된 상태에 따라 스타일 변경
                onPress={() => handleLightValueChange('blue')}
              >
                <Text style={styles.controlLightButtonText}>Blue</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.controlHum}>
            <View style={styles.toggleHumContainer}>
              <Text style={styles.controlTitle}>Humidifier</Text>
              <View style={styles.toggleSwitchContainer}>
                <Switch
                  value={humidifierValue}
                  onValueChange={handleHumidifierValueChange}
                />
              </View>
            </View> 
          </View>
          {/* <View style={styles.controlWhiteNoise}>
            <Text style={styles.controlTitle}>White Noise Player</Text>
            <MusicSelection
              selectedMusic={selectedMusic}
              onMusicChange={handleWhiteNoiseSelected}
            />
            <View style={styles.playprogress}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={totalTime}
                value={currentTime}
                onValueChange={handleSliderChange}
              />
              <TouchableOpacity style={styles.controlButton} onPress={handleWhiteNoisePlaying}>
                <Text style={styles.controlButtonText}>{whiteNoisePlaying ? 'Pause' : 'Play'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Text style={styles.timeText}>{formatTime(totalTime)}</Text>
            </View>
          </View> */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  sensorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensorTempBoxBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 30,
  },
  sensorTempBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  sensorTemp: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sensorHumBoxBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 60,
  },
  sensorHumBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  sensorHum: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  TempvalueContainer: {
    position: 'absolute',
    top: '52%',
    left: '52%',
    transform: [{ translateX: -33 }, { translateY: 0 }],
  },
  HumvalueContainer: {
    position: 'absolute',
    top: '52%',
    left: '48%',
    transform: [{ translateX: -20 }, { translateY: 0 }],
  },  
  sensorHalfCircle: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 100,
    marginTop: 20,
  },
  //조명조절
  controlContainer: {
    marginTop: 55,
    justifyContent: "space-between",
    width: "93%",
    alignItems: 'flex-start',
  },
  controlLight: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '125%',
  },
  buttonLight:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
    marginBottom: 30
  },
  controlLightButton: {
    paddingVertical: 9,
    paddingHorizontal: 20,
    backgroundColor: '#00e0ff',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  controlLightButtonText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: 'white',
  },
  //습도조절
  controlHum: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '110%',
    marginTop: 10
  },
  toggleHumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
    marginBottom: 50,
  }, 
  toggleSwitchContainer: {
    marginLeft: 'auto',
  },
  //노래
  controlWhiteNoise: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '110%',
    marginTop: 10
  },
  playprogress: {
    width: '92%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: -10,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    width: '128%',
    marginBottom: 50
  },
  timeText: {
    flex: 1,
  },
  controlButton: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    backgroundColor: '#00e0ff',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  controlButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  controlTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  }, 
  slider: {
    marginTop: -3,
    width: '75%',
  },
});

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}
