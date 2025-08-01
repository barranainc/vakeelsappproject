import React, {useEffect, useState} from 'react';
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
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {AppImages} from '../../Utils/ImagesUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useForm} from 'react-hook-form';
import {apiCall} from '../../services/apiCall';
import {clearLocalStorage, getFirebaseToken, showToast} from '../../helpers';
import InputField from '../../Components/textInputs/InputField';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

export default function Login({navigation, route}) {
  const {userType} = route.params || {};
  const [loader, setLoader] = useState(false);
  const [laywerStatus, setLawyerStatus] = useState(null);
  const {control, handleSubmit, watch} = useForm({
    defaultValues: {
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      cnic: null,
      password: null,
      barCouncilId: null,
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
    const firebaseToken = await getFirebaseToken()
    let obj = {
      email: data?.email,
      password: data?.password,
      fcm_token: firebaseToken,
    };
    console.log("obj",obj)
    try {
      setLoader(true);
      let result = await apiCall?.login(obj);
      // showToast('success', result?.message);
      await AsyncStorage.setItem('token', result?.data?.token);
      const jsonValue = JSON.stringify(result?.data);
      await AsyncStorage.setItem('UserLocalData', jsonValue);
      if (result?.data?.user_type == 'client') {
        navigation.navigate('ClientHome');
      } else if (result?.data?.user_type == 'lawyer') {
        if(result?.data?.is_approved == true){
          navigation.navigate('Home');
        }else{
          showToast('error', 
            result?.data?.is_approved===null?'Your registration request is pending':
            'Your registration request rejected by admin'
          );
        }
      
      } else if (result?.data?.user_type == 'paralegal') {
        navigation.navigate('Home');
      } else {
        navigation.goBack();
      }
      console.log("json",result)
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    const backAction = () => {
     navigation?.navigate('ContinueAs')
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(()=>{
    clearLocalStorage()
  },[])
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
        {/* <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Fine-tune this value if needed
        > */}
          <ImageBackground
            source={AppImages?.Login_Bg}
            style={styles.background}
            imageStyle={{flex: 1, resizeMode: 'cover'}} // Ensures the background covers the screen without distortion
          >
            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled">
              <View style={{width: '100%'}}>
                <TouchableOpacity
                  onPress={() => {
                    navigation?.navigate('ContinueAs')
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
                <Image
                  resizeMode="contain"
                  source={AppImages?.VakeelLogoWithoutName}
                  style={{height: 80, width: 80}}
                />
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

              <View style={{marginTop: 40, flex: 1}}>
                <Text style={styles.title}>Login</Text>

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
                 <Text onPress={()=>{
                  navigation?.navigate('Forgot Password',{data:"test"})
                 }} style={[styles.footer,{alignSelf:"flex-end"}]}>
                 Forgot password{' '}
                  </Text>
                <TouchableOpacity
                 disabled={loader?true:false}
                  style={styles.submitButton}
                  onPress={handleSubmit(onSubmit)}>
                  {loader ? (
                    <ActivityIndicator color={'#0F5189'} />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit</Text>
                  )}
                </TouchableOpacity>

                <View style={{alignItems: 'center'}}>
                  <Text style={styles.orText}>OR</Text>

                  <Text style={styles.footer}>
                  Don't have an account?{' '}
                    <Text
                      style={styles.loginText}
                      onPress={() => {
                        if (userType == 'client') {
                          navigation.navigate('ClientRegistration');
                        } else if (userType == 'Lawyer') {
                          navigation.navigate('LawyerRegister',{userType:userType});
                        } else if (userType == 'Paralegal') {
                          // navigation.navigate('Register');
                          navigation.navigate('LawyerRegister',{userType:userType});
                        } else {
                          navigation.goBack();
                        }
                      }}>
                      Register
                    </Text>
                  </Text>
                </View>
              </View>
            </ScrollView>
          </ImageBackground>
        {/* </KeyboardAvoidingView> */}
      {/* </TouchableWithoutFeedback> */}
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
    paddingTop: width * 0.138,
    paddingHorizontal: width * 0.055,
  },
  title: {
    fontSize: width * 0.093,
    fontFamily: 'Marathon-Serial Bold',
    color: '#404B53',
    marginBottom: width * 0.088,
  },
  input: {
    width: '100%',
    height: width * 0.15,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: width * 0.047,
    paddingHorizontal: width * 0.040,
    marginBottom: width * 0.040,
    fontSize: width * 0.040,
    backgroundColor: '#FFF',
    fontFamily: 'Poppins-Regular',
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
    fontSize: width * 0.045,
    fontFamily: 'Poppins-Regular',
  },
  orText: {
    color: '#888',
    fontSize: width * 0.045,
    marginVertical: width * 0.072,
    // backgroundColor:'red'
  },
  footer: {
    marginTop: 0,
    fontSize: width * 0.040,
    color: '#666',
  },
  loginText: {
    color: '#003366',
    fontWeight: 'bold',
  },
});
