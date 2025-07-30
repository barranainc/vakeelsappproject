import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform,
  ImageBackground,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { AppImages } from '../../Utils/ImagesUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Fine-tune this value if needed
        >
          <ImageBackground
            source={AppImages?.Login_Bg}
            style={styles.background}
            imageStyle={{ flex: 1, resizeMode: 'cover' }} // Ensures the background covers the screen without distortion
          >
            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ width: '100%', }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation?.goBack();
                  }}
                  style={{ backgroundColor: '#1C5A9A', padding: 5, width: '10%', borderRadius: 10 }}
                >
                  <Ionicons name="chevron-back-outline" size={20} color={'white'} />
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                <Image
                  resizeMode="contain"
                  source={AppImages?.logo}
                  style={{ height: 150, width: 150 }}
                />
              </View>

              <View style={{backgroundColor:'yellow', marginTop:30, flex:1}}>


                <Text style={styles.title}>Login</Text>

                <TextInput
                  style={styles.input}
                  placeholder="User Name/Bar Council ID"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>OR</Text>

                <Text style={styles.footer}>
                Already have an account?{' '}
                  <Text
                    style={styles.loginText}
                    onPress={() => navigation.navigate('Login')}
                  >
                    Register
                  </Text>
                </Text>

              </View>
            </ScrollView>
          </ImageBackground>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: height, // Ensures the background takes the full height of the screen
  },
  container: {
    // flexGrow: 1,
    paddingTop: 50,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 20,
    // backgroundColor: 'yellow',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Marathon-Serial Bold',
    color: '#404B53',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 16,
    color: '#888',
    marginVertical: 20,
  },
  footer: {
    marginTop: 0,
    fontSize: 14,
    color: '#666',
  },
  loginText: {
    color: '#003366',
    fontWeight: 'bold',
  },
});
