import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function SettingPage() {
  const [lightNotificationEnabled, setLightNotificationEnabled] = useState(false);
  const [temperatureNotificationEnabled, setTemperatureNotificationEnabled] = useState(false);
  const [humidityNotificationEnabled, setHumidityNotificationEnabled] = useState(false);
  const [bodyTemperatureNotificationEnabled, setBodyTemperatureNotificationEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          console.log('카메라 롤 접근 권한이 거부되었습니다.');
        }
      }
    })();
  }, []);

  const toggleLightNotification = () => {
    setLightNotificationEnabled(!lightNotificationEnabled);
  };

  const toggleTemperatureNotification = () => {
    setTemperatureNotificationEnabled(!temperatureNotificationEnabled);
  };

  const toggleHumidityNotification = () => {
    setHumidityNotificationEnabled(!humidityNotificationEnabled);
  };

  const toggleBodyTemperatureNotification = () => {
    setBodyTemperatureNotificationEnabled(!bodyTemperatureNotificationEnabled);
  };

  const selectProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectProfileImage} style={styles.profileImageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Text style={styles.profileImagePlaceholder}>프로필 사진 선택</Text>
        )}
      </TouchableOpacity>
      <View style={styles.noticontainer}>
        <View style={styles.notificationItem}>
          <Text>조명 알림</Text>
          <Switch
            value={lightNotificationEnabled}
            onValueChange={toggleLightNotification}
            trackColor={{ false: '#767577', true: '#45bcff' }}
            thumbColor={lightNotificationEnabled ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>

        <View style={styles.notificationItem}>
          <Text>온도 알림</Text>
          <Switch
            value={temperatureNotificationEnabled}
            onValueChange={toggleTemperatureNotification}
            trackColor={{ false: '#767577', true: '#45bcff' }}
            thumbColor={temperatureNotificationEnabled ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>

        <View style={styles.notificationItem}>
          <Text>습도 알림</Text>
          <Switch
            value={humidityNotificationEnabled}
            onValueChange={toggleHumidityNotification}
            trackColor={{ false: '#767577', true: '#45bcff' }}
            thumbColor={humidityNotificationEnabled ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>

        <View style={styles.notificationItem}>
          <Text>체온 알림</Text>
          <Switch
            value={bodyTemperatureNotificationEnabled}
            onValueChange={toggleBodyTemperatureNotification}
            trackColor={{ false: '#767577', true: '#45bcff' }}
            thumbColor={bodyTemperatureNotificationEnabled ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  profileImagePlaceholder: {
    fontSize: 16,
    color: 'gray',
  },
  noticontainer: {
    marginTop: 15
  },  
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
