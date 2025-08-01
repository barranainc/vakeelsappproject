import React, {useState} from 'react';
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
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {AppImages} from '../../Utils/ImagesUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import {endpoints, urls} from '../../services/Endpionts';
import InputField from '../../Components/textInputs/InputField';
import {useForm} from 'react-hook-form';
import { showToast } from '../../helpers';
import { apiCall } from '../../services/apiCall';
const {width, height} = Dimensions.get('window');

export default function ClientRegister({navigation}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {control, handleSubmit, watch} = useForm({
    defaultValues: {
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      password: null,
    },
  });
  const emailValidation = value => {
    const trimmedValue = value.trim();
    return (
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(trimmedValue) ||
      'Invalid email address'
    );
  };
  const onSubmit = async data => {
    let obj = {
      first_name: data?.firstName,
      last_name: data?.lastName,
      email: data?.email,
      phone: data?.phone,
      password: data?.password,
      picture: 'media/profile_picture.jpg',
      user_type: 'client',
    };
    try {
      setIsLoading(true);
      let result = await apiCall?.otpVerification(obj);
      showToast('success', result?.message);
      navigation.navigate('ClientOTP', {userData: obj});
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  // const handleRegister = async () => {
  //   // Validate inputs
  //   if (!firstName || !lastName || !email || !phone || !password) {
  //     Alert.alert('Error', 'All fields are required.');
  //     return;
  //   }
  //   const {_j} = DeviceInfo.getUniqueId(); // Get the device unique ID
  //   const headers = {
  //     'Content-Type': 'application/json',
  //     deviceuid: _j, // Add deviceuid to headers
  //   };

  //   const payload = {
  //     first_name: firstName,
  //     last_name: lastName,
  //     email: email,
  //     phone: phone,
  //     password: password,
  //     picture: 'media/profile_picture.jpg',
  //     user_type: 'client',
  //     // otp_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Example token
  //   };

  //   try {
  //     setIsLoading(true); // Show loader
  //     const response = await fetch(urls.LiveBaseUrl + endpoints.register_api, {
  //       method: 'POST',
  //       headers: headers,
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await response.json();
  //     console.log('Response data--->:', data);
  //     setIsLoading(false); // Hide loader

  //     if (response.ok) {
  //       if (data.responseCode == 206) {
  //         navigation.navigate('ClientOTP', {userData: payload}); // Navigate to the OTP screen
  //       }
  //       // Alert.alert('Success', 'Registration successful!');
  //     } else {
  //       Alert.alert('Error', data.message || 'Something went wrong.');
  //     }
  //   } catch (error) {
  //     setIsLoading(false); // Hide loader
  //     Alert.alert('Error', 'Failed to connect to the server.');
  //     console.error(error);
  //   }
  // };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
         {/* <ImageBackground
          source={AppImages?.Login_Bg}
          style={{flex: 1}}
          imageStyle={{resizeMode: 'cover'}}> */}
            <ScrollView
              contentContainerStyle={[styles.container, {paddingBottom: 20}]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View style={{width: '100%'}}>
                <TouchableOpacity
                  onPress={() => {
                    navigation?.goBack();
                  }}
                  style={{
                    backgroundColor: '#1C5A9A',
                    padding: 5,
                    width: '10%',
                    borderRadius: 10,
                  }}>
                  <Ionicons
                    name="chevron-back-outline"
                    size={20}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center', paddingVertical: 10}}>
              {/* <Image
                resizeMode="contain"
                source={AppImages?.VakeelLogoWithoutName}
                style={{height: 80, width: 80}}
              /> */}
                <Text
                  style={{
                    color: '#0F5189',
                    fontSize: 22,
                    fontFamily: 'Marathon-Serial Bold',
                    marginTop: 3,
                  }}>
                  VAKEEL'S
                </Text>
                <Text
                  style={{
                    color: '#0F5189',
                    fontSize: 6,
                    fontFamily: 'Marathon-Serial Bold',
                  }}>
                  A LEGAL CONSULTANCY
                </Text>
              </View>

              <View style={{marginTop: 40}}>
                <Text style={styles.title}>Register</Text>
                <InputField
                  name={'firstName'}
                  control={control}
                  rules={{
                    required: 'First Name is required',
                  }}
                  placeholder={'First Name'}
                />
                <InputField
                  name={'lastName'}
                  control={control}
                  rules={{
                    required: 'Lase Name is required',
                  }}
                  placeholder={'Lase Name'}
                />
                <InputField
                  name={'email'}
                  control={control}
                  rules={{
                    required: 'Email is required',
                    validate: emailValidation,
                  }}
                  placeholder={'Email'}
                />
                <InputField
                  name={'password'}
                  control={control}
                  secureTextEntry={true}
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long',
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])/,
                      message:
                        'Password must contain at least one uppercase letter',
                    },
                  }}
                  placeholder={'Password'}
                />
                <InputField
                  name={'phone'}
                  control={control}
                  rules={{
                    required: 'Phone No. is required',
                  }}
                  placeholder={'Phone'}
                  numpad
                />
                {/* <TextInput
                                    style={styles.input}
                                    placeholder="First Name"
                                    placeholderTextColor="#888"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Last Name"
                                    placeholderTextColor="#888"
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#888"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone No"
                                    placeholderTextColor="#888"
                                    value={phone}
                                    onChangeText={setPhone}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#888"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                /> */}
                                
                <TouchableOpacity
                 disabled={isLoading?true:false}
                  style={styles.submitButton}
                  onPress={handleSubmit(onSubmit)}
                  // onPress={() => { navigation.navigate('ClientOTP') }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Next</Text>
                  )}
                </TouchableOpacity>

                {/* <View style={{ alignItems: 'center' }}>
                                    <Text style={styles.orText}>OR</Text>

                                    <Text style={styles.footer}>
                                        Didn't have an account?{' '}
                                        <Text
                                            style={styles.loginText}
                                            onPress={() => navigation.goBack('Login')}
                                        >
                                            Login
                                        </Text>
                                    </Text>
                                </View> */}
              </View>
            </ScrollView>
          {/* </ImageBackground> */}
        </KeyboardAvoidingView>
      {/* </TouchableWithoutFeedback> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    paddingVertical: width * 0.138,
    paddingHorizontal: width * 0.055,
    paddingBottom:80
  },
  title: {
    fontSize: width * 0.1,
    fontFamily: 'Marathon-Serial Bold',
    color: 'black',
    marginBottom: width * 0.083,
  },
  input: {
    width: '100%',
    height: width * 0.15,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: width * 0.047,
    paddingHorizontal: width * 0.04,
    marginBottom: width * 0.04,
    fontSize: width * 0.04,
    backgroundColor: '#FFF',
    fontFamily: 'Poppins-Regular',
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: 'Marathon-Serial Regular',
    marginBottom: 20,
    color: '#A4A9AE',
  },
  uploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  uploadBox: {
    width: '48%',
    height: 80,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap:"wrap",
    gap:4
  },
  uploadBox1: {
    width: '30%',
    height: 100,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    height: width * 0.15,
    borderRadius: width * 0.047,
    marginTop: width * 0.026,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  orText: {
    color: '#888',
    fontSize: width * 0.045,
    marginVertical: width * 0.072,
  },
  footer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  loginText: {
    color: '#003366',
    fontWeight: 'bold',
  },
});
