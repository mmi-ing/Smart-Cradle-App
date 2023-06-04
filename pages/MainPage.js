import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import * as Notifications from 'expo-notifications';

export default function MainPage() {
  const [time, setTime] = useState(new Date());
  // const [currentDate, setCurrentDate] = useState();
  const [temperature, setTemperature] = useState(0);
  // const [birthDate, setBirthDate] = useState();
  // const [monthsSinceBirth, setMonthsSinceBirth] = useState(0);
  const [condition, setCondition] = useState('');
  // const [ledColor, setLedColor] = useState('off');
  const [isNotificationSent, setIsNotificationSent] = useState(false);
  const [diaperState, setDiaperState] = useState('');

  useEffect(() => {
    // const userBirthDate = new Date(2001, 4, 26);
    // setBirthDate(userBirthDate);

    // var date = new Date().getDate();
    // var month = new Date().getMonth() + 1;
    // var year = new Date().getFullYear();

    // setCurrentDate(year + '년 ' + month + '월 ' + date + '일 ');

    const fetchData = async () => {
      const headers = {
        Accept: 'application/json',
        'X-M2M-RI': '12345',
        'X-M2M-Origin': 'cap',
        'Content-Type': 'application/vnd.onem2m-res+json; ty=3',
      };
      const temperatureUrl = 'http://203.253.128.177:7579/Mobius/CapstonDesign/BabyTemp/la';
      const conditionUrl = 'http://203.253.128.177:7579/Mobius/CapstonDesign/CryState/la';
      const diaperStateUrl = 'http://203.253.128.177:7579/Mobius/CapstonDesign/Diaper/la';

      try {
        const [temperatureResponse, conditionResponse, diaperStateResponse] = await Promise.all([
          axios.get(temperatureUrl, { headers }),
          axios.get(conditionUrl, { headers }),
          axios.get(diaperStateUrl, { headers }),
        ]);

        const temperatureContent = temperatureResponse.data['m2m:cin'];
        if (temperatureContent && temperatureContent.con) {
          const tempValue = Number(temperatureContent.con);
          setTemperature(tempValue);
          if (tempValue > 37.5) {
            sendTemperatureNotification(tempValue);
            setLedColor('red');
          }
        } else {
          console.log('There is no temperature data to show.');
          setTemperature(0);
        }

        const conditionContent = conditionResponse.data['m2m:cin'];
        if (conditionContent && conditionContent.con) {
          const state = Number(conditionContent.con);
          setCondition(getConditionText(state));
        } else {
          console.log('There is no condition data to show.');
          setCondition('');
        }

        const diaperStateContent = diaperStateResponse.data['m2m:cin'];
        if (diaperStateContent && diaperStateContent.con) {
          const state = Number(diaperStateContent.con);
          setDiaperState(state.toString());
        } else {
          console.log('There is no diaper state data to show.');
          setDiaperState('');
        }
      } catch (error) {
        console.log('There was a problem fetching data:', error);
        setTemperature(0);
        setCondition('');
        setDiaperState('');
      }
    };

    const interval = setInterval(() => {
      setTime(new Date());
      fetchData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   if (birthDate) {
  //     const now = new Date();
  //     const months = (now.getFullYear() - birthDate.getFullYear()) * 12;
  //     const monthDifference = now.getMonth() - birthDate.getMonth();
  //     const totalMonths = months + monthDifference;
  //     setMonthsSinceBirth(totalMonths);
  //   }
  // }, [birthDate]);

  const popup = () => {
    Alert.alert('Check the gallery');
  };



  useEffect(() => {
    // Request and initialize push notifications
    const registerForPushNotificationsAsync = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('푸시 알림 권한을 허용해야 알림을 받을 수 있습니다.');
        return;
      }
      // Get push token
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token:', token);
      // Send the token to the server or use it wherever needed
    };
  
    registerForPushNotificationsAsync();
  }, []);

  const sendTemperatureNotification = (tempValue) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Temperature Alert',
        body: `Temperature is above 37.5°C (${tempValue}°C)`,
      },
      trigger: null, // Send immediately
    });
  };

  const setLedColor = (color) => {
    const LEDUrl = 'http://203.253.128.177:7579/Mobius/CapstonDesign/LED';

    let LEDCode;
    switch (color) {
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
      'm2m:cin': {
        con: LEDCode.toString(),
      },
    };

    axios
      .request({
        method: 'post',
        url: LEDUrl,
        headers: {
          Accept: 'application/json',
          'X-M2M-RI': '12345',
          'X-M2M-Origin': 'cap',
          'Content-Type': 'application/vnd.onem2m-res+json; ty=3',
        },
        data,
      })
      .then((response) => {
        console.log('Temp LED value updated successfully.');
      })
      .catch((error) => {
        console.log('Error updating Temp LED value:', error);
      });
  };


  const getConditionText = (state) => {
    switch (state) {
      case 0:
        return 'bellypain';
      case 1:
        return 'burping';
      case 2:
        return 'discomfort';
      case 3:
        return 'hungry';
      case 4:
        return 'tired';
      case 5:
        return 'Not Cry';
    }
  };

  const renderDiaperState = () => {
    if (diaperState === '0') {
      return (
        <Text style={styles.diaperStateText}>😃</Text>
      );
    } else if (diaperState === '1') {
      return (
        <Text style={styles.diaperStateText}>💩</Text>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.textBox}> */}
        {/* <Text style={styles.time}>
          {currentDate}
          {time.toLocaleTimeString('en-US')}
        </Text> */}
        {/* <Text style={styles.birthtext}>Months Since Birth: {monthsSinceBirth}</Text> */}
      {/* </View> */}
      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: 'http://192.168.0.50:8090/?action=stream' }}
          style={styles.webview}
        />
      </View>
      <View style={styles.boxAll}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.box1}>
            <Text style={styles.boxText}>Condition</Text>
            <Text style={styles.ConditionText}>{condition}</Text>
          </View>
          <View style={styles.box2}>
            <Text style={styles.boxText}>Temperature</Text> 
            <Text style={styles.tempText}>{temperature}°C</Text>
          </View>
          <View style={styles.box3}>
            <Text style={styles.boxText}>Physiological phenomena</Text>
            <Text style={styles.DiaperText}>{renderDiaperState()}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={popup}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textBox: {
    height: 60,
  },
  time: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 5,
  },
  birthtext: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    fontWeight: '500',
    marginTop: 0,
    marginBottom: 20,
  },
  webviewContainer: {
    flex: 1,
    transform: [{ rotate: '90deg' }, { translateX: 0}, {translateY: 60 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    alignSelf: 'stretch',
    aspectRatio: 1 / 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  boxAll: {
    marginTop: 10,
    height: 180,
    justifyContent: 'flex-start',
  },
  box1: {
    marginTop: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  ConditionText: {
    textAlign: 'right',
    fontSize: 20,
    color: 'black',
    fontWeight: '300',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 20,
  },
  box2: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  tempText: {
    textAlign: 'right',
    fontSize: 20,
    color: 'black',
    fontWeight: '300',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 20,
  },
  box3: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  DiaperText: {
    textAlign: 'right',
    fontSize: 20,
    color: 'black',
    fontWeight: '300',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 20,
  },
  boxText: {
    fontSize: 20,
    padding: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#00e0ff',
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'normal',
    textAlign: 'center'
  },
});
