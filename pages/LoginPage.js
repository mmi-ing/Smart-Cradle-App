// import React, { useState } from 'react';
// import { StyleSheet, View, TextInput, Button } from 'react-native';
// import axios from 'axios';
// import { SERVER_URL } from '../constants';


// const LoginPage = ({ navigation }) => {
//   const [nickname, setNickname] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.get(
//         `${SERVER_URL}/user/get/userId/${nickname}&${password}`
//       );
//       const userData = response.data;

//       if (userData.length === 0) {
//         console.log('User not found');
//       } else {
//         console.log('User found:', userData);
//         navigation.navigate("BottomTab");
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleJoin = () => {
//     navigation.navigate('JoinPage');
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Nickname"
//         onChangeText={(text) => setNickname(text)}
//         value={nickname}
//       />
//       <TextInput
//         placeholder="Password"
//         onChangeText={(text) => setPassword(text)}
//         value={password}
//       />
//       <Button title="Login" onPress={handleSubmit} />
//       <Button title="Join" onPress={handleJoin} />
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
// });

// export default LoginPage;



import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '../constants';

const LoginPage = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/user/get/userId/${nickname}&${password}`
      );
      const userData = response.data;

      if (userData.length === 0) {
        console.log('User not found');
      } else {
        console.log('User found:', userData);
        navigation.navigate('BottomTab');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = () => {
    navigation.navigate('JoinPage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nickname"
          onChangeText={(text) => setNickname(text)}
          value={nickname}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
      </View>
      <Button title="Login" onPress={handleSubmit} />
      <Button title="Join" onPress={handleJoin} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default LoginPage;
