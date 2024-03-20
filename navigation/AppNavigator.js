// AppNavigator.js
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import HomePage from '../screens/HomePage';
import Library from '../screens/Library';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Search from '../screens/Search';
import BookDetails from '../screens/BookDetails';
import Profile from '../screens/Profile';
import Shelves from '../screens/Shelves';

const Stack = createStackNavigator();

const AppNavigator = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchLoggedInStatus = async () => {
      try {
        const storedLoggedInStatus = await AsyncStorage.getItem('isLoggedIn');
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedLoggedInStatus !== null) {
          setIsLoggedIn(storedLoggedInStatus === 'true');
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error fetching logged in status:', error);
      }
    };
    fetchLoggedInStatus();
  }, []);

  const handleLogin = (userId, navigation) => {
    setIsLoggedIn(true);
    setUserId(userId); 
    AsyncStorage.setItem('isLoggedIn', 'true').catch(error => console.error('Error saving logged in status:', error));
    AsyncStorage.setItem('userId', userId.toString()).catch(error => console.error('Error saving user ID:', error));
    navigation.navigate('HomePage');
  };

  const handleLogout = (navigation) => {
    setIsLoggedIn(false);
    setUserId(null);
    AsyncStorage.setItem('isLoggedIn', 'false').catch(error => console.error('Error saving logged in status:', error));
    AsyncStorage.setItem('userId', "").catch(error => console.error('Error saving user ID:', error));
    navigation.navigate('Login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: "100%" }}>
      <Stack.Navigator
        initialRouteName="Content"
      >
        <Stack.Screen 
          name="HomePage" 
          options={{ 
            title: 'Accueil',
            header: ({ navigation }) => <Header navigation={navigation} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />,
          }}
        >
          {(props) => <HomePage {...props} />}
        </Stack.Screen>

        <Stack.Screen 
          name="Library" 
          options={{ 
            title: 'Bibliothèque',
            header: ({ navigation }) => <Header navigation={navigation} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />,
          }}
          initialParams={{ userId: userId }}
        >
          {(props) => <Library {...props} />}
        </Stack.Screen>

        <Stack.Screen 
          name="Search" 
          options={{ 
            title: 'Recherche',
            header: ({ navigation }) => <Header navigation={navigation} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />,
          }}
          >
            {(props) => <Search {...props} />}
        </Stack.Screen>

        <Stack.Screen 
          name="Shelves" 
          options={({ route, navigation }) => ({ 
            title: route.params.shelf,
            header: ({ navigation }) => <Header navigation={navigation} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>,
          })}
          initialParams={{ userId: userId }}
          >
            {(props) => <Shelves {...props}/>}
        </Stack.Screen>

        <Stack.Screen
          name="BookDetails"
          options={({ route, navigation }) => ({
            title: route.params.book && route.params.book.volumeInfo && route.params.book.volumeInfo.title
            ? route.params.book.volumeInfo.title
            : (route.params.book && route.params.book.details && route.params.book.details.volumeInfo && route.params.book.details.volumeInfo.title)
            ? route.params.book.details.volumeInfo.title
            : 'Book Details',
            header: ({ navigation }) => <Header navigation={navigation} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />,
          })}
          initialParams={{ userId: userId }}
          >
            {(props) => <BookDetails {...props}/>}
        </Stack.Screen>

        <Stack.Screen 
          name="Profile" 
          options={{ 
            title: 'Profil',
            header: ({ navigation }) => <Header navigation={navigation} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>,
          }}
          initialParams={{ userId: userId }}
          >
            {(props) => <Profile {...props}/>}
        </Stack.Screen>

        <Stack.Screen 
          name="Login"
          options={{ 
            title: 'Se connecter',
            header: ({ navigation }) => <Header navigation={navigation} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />,
          }}
          >
            {(props) => <Login handleLogin={(userId) => handleLogin(userId, props.navigation)} {...props}/>}
        </Stack.Screen>

        <Stack.Screen 
          name="Register" 
          options={{ 
            title: 'Créer un compte',
            header: ({ navigation }) => <Header navigation={navigation} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>,
          }}
          >
            {(props) => <Register {...props}/>}
        </Stack.Screen>

      </Stack.Navigator>
    </div>
  );
};

export default AppNavigator;
