import React from 'react';
import { View, Text, Pressable } from 'react-native';

const NavigationBar = ({ navigation, isLoggedIn, handleLogout }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 50, backgroundColor: '#f4511e' }}>

      {!isLoggedIn && (
        <>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: '#fff' }}>Se connecter</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: '#fff' }}>Créer un compte</Text>
        </Pressable>
        </>
      )}
      {isLoggedIn && (
        <>
        <Pressable onPress={() => navigation.navigate('HomePage')}>
          <Text style={{ color: '#fff' }}>Accueil</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Library')}>
          <Text style={{ color: '#fff' }}>Bibliothèque</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Search')}>
          <Text style={{ color: '#fff' }}>Rechercher</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Profile')}>
          <Text style={{ color: '#fff' }}>Profil</Text>
        </Pressable>
        <Pressable onPress={() => handleLogout(navigation)}>
          <Text style={{ color: '#fff' }}>Se déconnecter</Text>
        </Pressable>
        </>
      )}
    </View>
  );
};

export default NavigationBar;
