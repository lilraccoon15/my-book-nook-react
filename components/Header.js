import React from 'react';
import { View} from 'react-native';
import NavigationBar from './NavigationBar';

const Header = ({ navigation, isLoggedIn, handleLogout }) => {
  return (
    <View>
      <NavigationBar 
        navigation={navigation} 
        isLoggedIn={isLoggedIn} 
        handleLogout={handleLogout} 
      />
    </View>
  );
};

export default Header;
