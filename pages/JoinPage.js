import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Alert } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '../constants';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';


const JoinPage = () => {
  const [babyBirthHour, setBabyBirthHour] = useState('');
  const [babyBirthMinute, setBabyBirthMinute] = useState('');
  const [babyBirthSecond, setBabyBirthSecond] = useState('');
  const [babyName, setBabyName] = useState('');
  const [babyGender, setBabyGender] = useState('');
  const [babyBirthYear, setBabyBirthYear] = useState('');
  const [babyBirthMonth, setBabyBirthMonth] = useState('');
  const [babyBirthDay, setBabyBirthDay] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleGoBack = () => {
    // navigation.navigate('LoginPage');
    navigation.goBack();
  };

  const handleSubmit = async () => {
    const formatNumber = (num) => {
      return num < 10 ? `0${num}` : `${num}`;
    };

    const babyBirth = `${babyBirthYear}-${formatNumber(babyBirthMonth)}-${formatNumber(babyBirthDay)}T${formatNumber(babyBirthHour)}:${formatNumber(babyBirthMinute)}:${formatNumber(babyBirthSecond)}`;
    console.log('Baby birth:', babyBirth);

    try {
      const response = await axios.post(`${SERVER_URL}/user/create`, {
        nickname: nickname,
        password: password,
        baby_name: babyName,
        baby_gender: babyGender,
        baby_birth: babyBirth
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'User created successfully', [{ text: 'OK', onPress: handleGoBack }]);
      } else {
        Alert.alert('Error', 'Failed to create user');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to create user');
    }
  };

  const generateYearItems = () => {
    const items = [];
    for (let i = 2000; i <= new Date().getFullYear(); i++) {
      items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
    }
    return items;
  };

  const generateMonthItems = () => {
    const items = [];
    for (let i = 1; i <= 12; i++) {
      items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
    }
    return items;
  };

  const generateDayItems = () => {
    const items = [];
    for (let i = 1; i <= 31; i++) {
      items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
    }
    return items;
  };

  const generateHourItems = () => {
    const items = [];
    for (let i = 0; i < 24; i++) {
      items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
    }
    return items;
  };

  const generateMinuteItems = () => {
    const items = [];
    for (let i = 0; i < 60; i++) {
      items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
    }
    return items;
  };

  const generateSecondItems = () => {
    const items = [];
    for (let i = 0; i < 60; i++) {
      items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
    }
    return items;
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Baby Name" onChangeText={(text) => setBabyName(text)} value={babyName}/>
      <Picker style={styles.genderP}selectedValue={babyGender}onValueChange={(itemValue) => setBabyGender(itemValue)}>
        <Picker.Item label="Gender" value="" />
        <Picker.Item label="Male" value="MALE" />
        <Picker.Item label="Female" value="FEMALE" />
      </Picker>

      <Text style={styles.pickerLabel}>Baby Birth</Text>
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={babyBirthYear}
          onValueChange={(value) => setBabyBirthYear(value)}
        >
          <Picker.Item label="Year" value={new Date().getFullYear()} />
          {generateYearItems()}
        </Picker>
        <Picker
          style={styles.picker}
          selectedValue={babyBirthMonth}
          onValueChange={(value) => setBabyBirthMonth(value)}
        >
          <Picker.Item label="Month" value={new Date().getMonth() + 1} />
          {generateMonthItems()}
        </Picker>
        <Picker
          style={styles.picker}
          selectedValue={babyBirthDay}
          onValueChange={(value) => setBabyBirthDay(value)}
        >
          <Picker.Item label="Day" value={new Date().getDate()} />
          {generateDayItems()}
        </Picker>
        <Picker
          style={styles.picker}
          selectedValue={babyBirthHour}
          onValueChange={(value) => setBabyBirthHour(value)}
        >
          <Picker.Item label="Hour" value={new Date().getHours()} />
          {generateHourItems()}
        </Picker>
        <Picker
          style={styles.picker}
          selectedValue={babyBirthMinute}
          onValueChange={(value) => setBabyBirthMinute(value)}
        >
          <Picker.Item label="Minute" value={new Date().getMinutes()} />
          {generateMinuteItems()}
        </Picker>
        <Picker
          style={styles.picker}
          selectedValue={babyBirthSecond}
          onValueChange={(value) => setBabyBirthSecond(value)}
        >
          <Picker.Item label="Second" value={new Date().getSeconds()} />
          {generateSecondItems()}
        </Picker>
      </View>

      <TextInput
        placeholder="Nickname"
        onChangeText={(text) => setNickname(text)}
        value={nickname}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  genderP:{
    width: 200,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pickerContainer: {
    flexDirection: 'row',
  },
  picker: {
    flex: 1,
  }
});

export default JoinPage;



// import React, { useState } from 'react';
// import { StyleSheet, View, TextInput, Button, Text, Alert } from 'react-native';
// import axios from 'axios';
// import { SERVER_URL } from '../constants';
// import { Picker } from '@react-native-picker/picker';
// import { useNavigation } from '@react-navigation/native';


// const JoinPage = () => {
//   const [babyBirthHour, setBabyBirthHour] = useState('');
//   const [babyBirthMinute, setBabyBirthMinute] = useState('');
//   const [babyBirthSecond, setBabyBirthSecond] = useState('');
//   const [babyName, setBabyName] = useState('');
//   const [babyGender, setBabyGender] = useState('');
//   const [babyBirthYear, setBabyBirthYear] = useState('');
//   const [babyBirthMonth, setBabyBirthMonth] = useState('');
//   const [babyBirthDay, setBabyBirthDay] = useState('');
//   const [nickname, setNickname] = useState('');
//   const [password, setPassword] = useState('');

//   const navigation = useNavigation();

//   const handleGoBack = () => {
//     navigation.goBack();
//   };

//   const handleSubmit = async () => {
//     const formatNumber = (num) => {
//       return num < 10 ? `0${num}` : `${num}`;
//     };

//     const babyBirth = `${babyBirthYear}-${formatNumber(babyBirthMonth)}-${formatNumber(babyBirthDay)}T${formatNumber(babyBirthHour)}:${formatNumber(babyBirthMinute)}:${formatNumber(babyBirthSecond)}`;
//     console.log('Baby birth:', babyBirth);

//     try {
//       const response = await axios.post(`${SERVER_URL}/user/create`, {
//         nickname: nickname,
//         password: password,
//         baby_name: babyName,
//         baby_gender: babyGender,
//         baby_birth: babyBirth
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         Alert.alert('Success', 'User created successfully', [{ text: 'OK', onPress: handleGoBack }]);
//       } else {
//         Alert.alert('Error', 'Failed to create user');
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', 'Failed to create user');
//     }
//   };

//   const generateYearItems = () => {
//     const items = [];
//     for (let i = 2000; i <= new Date().getFullYear(); i++) {
//       items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
//     }
//     return items;
//   };

//   const generateMonthItems = () => {
//     const items = [];
//     for (let i = 1; i <= 12; i++) {
//       items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
//     }
//     return items;
//   };

//   const generateDayItems = () => {
//     const items = [];
//     for (let i = 1; i <= 31; i++) {
//       items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
//     }
//     return items;
//   };

//   const generateHourItems = () => {
//     const items = [];
//     for (let i = 0; i < 24; i++) {
//       items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
//     }
//     return items;
//   };

//   const generateMinuteItems = () => {
//     const items = [];
//     for (let i = 0; i < 60; i++) {
//       items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
//     }
//     return items;
//   };

//   const generateSecondItems = () => {
//     const items = [];
//     for (let i = 0; i < 60; i++) {
//       items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
//     }
//     return items;
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Join</Text>
//       <TextInput style={styles.input} placeholder="Nickname" onChangeText={(text) => setNickname(text)} value={nickname} />
//       <TextInput style={styles.input} placeholder="Password" onChangeText={(text) => setPassword(text)} value={password} />
//       <TextInput style={styles.input} placeholder="Baby Name" onChangeText={(text) => setBabyName(text)} value={babyName} />
//       <View style={styles.pickerContainer}>
//         <Picker
//           style={styles.picker}
//           selectedValue={babyBirthYear}
//           onValueChange={(value) => setBabyBirthYear(value)}
//         >
//           <Picker.Item label="Year" value="" />
//           {generateYearItems()}
//         </Picker>
//         <Picker
//           style={styles.picker}
//           selectedValue={babyBirthMonth}
//           onValueChange={(value) => setBabyBirthMonth(value)}
//         >
//           <Picker.Item label="Month" value="" />
//           {generateMonthItems()}
//         </Picker>
//         <Picker
//           style={styles.picker}
//           selectedValue={babyBirthDay}
//           onValueChange={(value) => setBabyBirthDay(value)}
//         >
//           <Picker.Item label="Day" value="" />
//           {generateDayItems()}
//         </Picker>
//         <Picker
//           style={styles.picker}
//           selectedValue={babyBirthHour}
//           onValueChange={(value) => setBabyBirthHour(value)}
//         >
//           <Picker.Item label="Hour" value="" />
//           {generateHourItems()}
//         </Picker>
//         <Picker
//           style={styles.picker}
//           selectedValue={babyBirthMinute}
//           onValueChange={(value) => setBabyBirthMinute(value)}
//         >
//           <Picker.Item label="Minute" value="" />
//           {generateMinuteItems()}
//         </Picker>
//         <Picker
//           style={styles.picker}
//           selectedValue={babyBirthSecond}
//           onValueChange={(value) => setBabyBirthSecond(value)}
//         >
//           <Picker.Item label="Second" value="" />
//           {generateSecondItems()}
//         </Picker>
//       </View>
//       <Button title="Submit" onPress={handleSubmit} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     height: 40,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//   },
//   pickerContainer: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   picker: {
//     flex: 1,
//     marginRight: 5,
//   },
// });

// export default JoinPage;


// import React, { useState } from 'react';
// import { StyleSheet, View, TextInput, Button, Text, Alert } from 'react-native';
// import axios from 'axios';
// import { SERVER_URL } from '../constants';
// import { useNavigation } from '@react-navigation/native';

// const JoinPage = () => {
//   const [babyName, setBabyName] = useState('');
//   const [babyGender, setBabyGender] = useState('');
//   const [babyBirthYear, setBabyBirthYear] = useState('');
//   const [babyBirthMonth, setBabyBirthMonth] = useState('');
//   const [babyBirthDay, setBabyBirthDay] = useState('');
//   const [nickname, setNickname] = useState('');
//   const [password, setPassword] = useState('');

//   const navigation = useNavigation();

//   const handleGoBack = () => {
//     navigation.goBack();
//   };

//   const handleSubmit = async () => {
//     const formatNumber = (num) => {
//       return num < 10 ? `0${num}` : `${num}`;
//     };

//     const babyBirth = `${babyBirthYear}-${formatNumber(babyBirthMonth)}-${formatNumber(babyBirthDay)}T${formatNumber(babyBirthHour)}:${formatNumber(babyBirthMinute)}:${formatNumber(babyBirthSecond)}`;
//     console.log('Baby birth:', babyBirth);

//     try {
//       const response = await axios.post(`${SERVER_URL}/user/create`, {
//         nickname: nickname,
//         password: password,
//         baby_name: babyName,
//         baby_gender: babyGender,
//         baby_birth: babyBirth
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         Alert.alert('Success', 'User created successfully', [{ text: 'OK', onPress: handleGoBack }]);
//       } else {
//         Alert.alert('Error', 'Failed to create user');
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', 'Failed to create user');
//     }
//   };

//   const handleGenderSelect = (gender) => {
//     setBabyGender(gender);
//   };

//   const generateYearItems = () => {
//     const items = [];
//     for (let i = 2000; i <= new Date().getFullYear(); i++) {
//       items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
//     }
//     return items;
//   };

//   const generateMonthItems = () => {
//     const items = [];
//     for (let i = 1; i <= 12; i++) {
//       items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
//     }
//     return items;
//   };

//   const generateDayItems = () => {
//     const items = [];
//     for (let i = 1; i <= 31; i++) {
//       items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
//     }
//     return items;
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Join</Text>
//       <TextInput style={styles.input} placeholder="Nickname" onChangeText={(text) => setNickname(text)} value={nickname}/>
//       <TextInput style={styles.input} placeholder="Password" onChangeText={(text) => setPassword(text)} value={password}/>
//       <TextInput style={styles.input} placeholder="Baby Name" onChangeText={(text) => setBabyName(text)} value={babyName}/>
//       <View style={styles.genderButtonContainer}>
//         <Button
//           title="Male"
//           onPress={() => handleGenderSelect('Male')}
//           color={babyGender === 'Male' ? '#007bff' : '#ccc'}
//         />
//         <Button
//           title="Female"
//           onPress={() => handleGenderSelect('Female')}
//           color={babyGender === 'Female' ? '#007bff' : '#ccc'}
//         />
//       </View>
      
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     height: 40,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//   },
//   genderButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 10,
//   },
//   // Rest of the styles
// });

// export default JoinPage;
