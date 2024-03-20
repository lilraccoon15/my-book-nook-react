import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios'; 

const Login = ({ handleLogin, navigation }) => { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onPressLogin = async () => { 
    try {
      if (!email || !password) {
        Alert.alert('Veuillez remplir tous les champs');
        return;
      }

      const response = await axios.post('http://localhost:3000/login', {
        email: email,
        password: password
      });

      if (response.data.success) {
        Alert.alert('Connexion réussie !');
        const userId = response.data.id;
        handleLogin(userId, navigation);
      } else {
        Alert.alert('Identifiants incorrects');
      }
    } catch (error) {
      Alert.alert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      console.error('Erreur lors de la connexion : ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connectez-vous</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        inputMode="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Se connecter" onPress={onPressLogin} /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default Login;
