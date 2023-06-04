import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import NetInfo from '@react-native-community/netinfo';

import CheckPage from "./pages/CheckPage";
import DiaryPage from "./pages/DiaryPage";
import MainPage from "./pages/MainPage";
import CommunityPage from "./pages/CommunityPage";
import SettingPage from "./pages/SettingPage";
import LoginPage from "./pages/LoginPage";
import JoinPage from "./pages/JoinPage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);

export default function App() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const BottomTabNavigator = () => (
    <Tab.Navigator initialRouteName="Baby">
      <Tab.Screen name="Check" component={CheckPage} options={{tabBarIcon: () => (<Ionicons name="ios-checkmark-circle-outline" size={24} color={"black"} />),}} />
      <Tab.Screen name="Diary" component={DiaryPage} options={{tabBarIcon: () => (<MaterialCommunityIcons name="notebook-edit-outline" size={24} color={"black"} />),}} />
      <Tab.Screen name="Baby" component={MainPage} options={{tabBarIcon: () => (<MaterialCommunityIcons name="baby-face-outline" size={24} color={"black"} />),}} />
      <Tab.Screen name="Community" component={CommunityPage} options={{tabBarIcon: () => (<Ionicons name="ios-people-circle-outline" size={24} color={"black"} />),}}/>
      <Tab.Screen name="Setting" component={SettingPage} options={{tabBarIcon: () => (<Ionicons name="settings-outline" size={24} color={"black"} />),}}/>
    </Tab.Navigator>
  );

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginPage">
          <Stack.Screen name="LoginPage" component={LoginPage} options={{headerShown: false}}/>
          <Stack.Screen name="JoinPage" component={JoinPage} options={{headerShown: false}}/>
          <Stack.Screen name="BottomTab" component={BottomTabNavigator} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
