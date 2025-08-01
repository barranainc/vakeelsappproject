import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
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
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {AppImages} from '../../Utils/ImagesUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import InputField from '../../Components/textInputs/InputField';
import DocumentPicker, {types} from 'react-native-document-picker';
import axios from 'axios';
import {useForm, Controller} from 'react-hook-form';
import {enviroment} from '../../environment';
import {Apis} from '../../services/Endpoints';
import {
  getDocumentUrl,
  getMultipleDocumentUrl,
  requestCameraPermission,
  showToast,
} from '../../helpers';
import {apiCall} from '../../services/apiCall';
const {width, height} = Dimensions.get('window');
export default function LawyerRegister({navigation, route}) {
  const {userType} = route.params || {};
  const [barDocs, setBarDocs] = useState([]); // Placeholder for multiple documents
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [loader, setLoader] = useState(false);
  const [cnicFrontLoader, setCnicFrontLoader] = useState(false);
  const [cnicBackLoader, setCnicBackLoader] = useState(false);
  const [barDocsLoader, setBarDocsLoader] = useState(false);
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
    let obj = {
      phone: data?.phone,
      email: data?.email?.toLowerCase(),
    };
    try {
      setLoader(true);
      let result = await apiCall?.otpVerification(obj);
      const formatedData = {...data, cnicFront, cnicBack, barDocs, userType};
      showToast('success', result?.message);
      navigation?.navigate('LawyerOtp', {
        data: formatedData,
      });
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };
  const handleCNICFront = useCallback(async onChange => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'App gallery Permission',
        message:
          'App needs access to your gallery ' + 'so you can upload pictures',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      try {
        setCnicFrontLoader(true);
        const response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        });
        // setCnicFront(response);
        await getDocument(response, 'cnicFront');
        onChange(response);
      } catch (err) {
        onChange(undefined);
      } finally {
        setCnicFrontLoader(false);
      }
    } else {
      // alert('Camera permission denied');
      const againPermission = requestCameraPermission();
      onChange(undefined);
    }
  }, []);
  const handleCNICBack = useCallback(async onChange => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'App gallery Permission',
        message:
          'App needs access to your gallery ' + 'so you can upload pictures',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      try {
        setCnicBackLoader(true);
        const response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        });
        // setCnicBack(response);
        await getDocument(response, 'cnicBack');
        onChange(response);
      } catch (err) {
        onChange(undefined);
      } finally {
        setCnicBackLoader(false);
      }
    } else {
      const againPermission = await requestCameraPermission();
      // alert('Camera permission denied');
      onChange(undefined);
    }
  }, []);
  const handleBarCouncilDoc = useCallback(async onChange => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'App gallery Permission',
        message:
          'App needs access to your gallery ' + 'so you can upload pictures',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      try {
        setBarDocsLoader(true);
        const response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          allowMultiSelection: true,
          type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        });
        // setCnicBack(response);
        await getDocument(response, 'barCouncilDoc', onChange);
        onChange(response);
      } catch (err) {
        onChange(undefined);
      } finally {
        setBarDocsLoader(false);
      }
    } else {
      const againPermission = await requestCameraPermission();
      // alert('Camera permission denied');
      onChange(undefined);
    }
  }, []);
  const getDocument = async (document, docType) => {
    try {
      // setCnicFrontLoader(true);
      const docUrl = await getDocumentUrl(document);
      if (docType === 'cnicFront') {
        if (docUrl === 'Error uploading document') {
          showToast('error', 'Large file uploaded. File size must be in Kbs');
        } else {
          setCnicFront(docUrl);
        }
      } else if (docType === 'cnicBack') {
        if (docUrl === 'Error uploading document') {
          showToast('error', 'Large file uploaded. File size must be in Kbs');
        } else {
          setCnicBack(docUrl);
        }
      } else {
        const multipleDocumentUrl = await getMultipleDocumentUrl(document);
        if (multipleDocumentUrl === 'Error uploading document') {
          showToast('error', 'Large file uploaded. File size must be in Kbs');
        } else {
          setBarDocs(multipleDocumentUrl);
        }
      }
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      // setCnicFrontLoader(false);
    }
  };
  const removeCnicFront = (itemId, onChange) => {
    // Use filter to create a new array without the item to be removed
    setCnicFront(null);
    onChange(null);
  };
  const removeCnicBack = (itemId, onChange) => {
    // Use filter to create a new array without the item to be removed
    setCnicBack(null);
    onChange(null);
  };
  const removeBarDoc = (itemId, onChange) => {
    // Use filter to create a new array without the item to be removed
    const updatedData = barDocs?.filter(item => item !== itemId);
    // Update the state with the new array
    if (updatedData?.length === 0) {
      onChange(null);
    }
    setBarDocs(updatedData);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
      {/* <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}> */}
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            {paddingBottom: 20, flexGrow: 1},
          ]}
          keyboardShouldPersistTaps="handled">
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
              <Ionicons name="chevron-back-outline" size={20} color={'white'} />
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

          <View style={{marginTop: width * 0.14}}>
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
              placeholder={'Last Name'}
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
            <InputField
              name={'cnic'}
              control={control}
              rules={{
                required: 'CNIC is required',
              }}
              placeholder={'CNIC'}
              numpad
            />
            <InputField
              name={'barCouncilId'}
              control={control}
              rules={{
                required: 'Bar Council ID is required',
              }}
              placeholder={'Bar Council ID'}
            />

            {/* {cnicFrontLoader ? (
                <View style={styles.uploadDocBox}>
                  <ActivityIndicator size="large" color={'#EAA141'} />
                </View>
              ) : ( */}
            <>
              <Text style={styles.sectionTitle}>Upload CNIC</Text>
              <View style={styles.uploadContainer}>
                <View style={styles.parentBox}>
                  <Controller
                    control={control}
                    rules={{required: 'Front CNIC is required'}}
                    render={({
                      field: {onChange, value},
                      fieldState: {error},
                    }) => (
                      <>
                        <TouchableOpacity
                          style={styles.uploadBox}
                          onPress={() => handleCNICFront(onChange)}>
                          {cnicFrontLoader ? (
                            <ActivityIndicator size="large" color={'#EAA141'} />
                          ) : cnicFront ? (
                            <>
                              <TouchableOpacity
                                style={styles?.cross}
                                onPress={() => {
                                  removeCnicFront(cnicFront, onChange);
                                }}>
                                <Entypo
                                  name="circle-with-cross"
                                  size={width * 0.05}
                                  color={'red'}
                                />
                              </TouchableOpacity>
                              <Image
                                style={styles.cnicImage}
                                source={{
                                  uri: enviroment?.API_URL + cnicFront,
                                }}
                              />
                            </>
                          ) : (
                            <Ionicons
                              name="add"
                              size={width * 0.1}
                              color={'#EAA141'}
                            />
                          )}
                        </TouchableOpacity>
                        {error && (
                          <Text style={[styles?.error]}>{error?.message}</Text>
                        )}
                      </>
                    )}
                    name={'cnicFront'}
                  />
                </View>
                <View style={styles.parentBox}>
                  <Controller
                    control={control}
                    rules={{required: 'Back CNIC is required'}}
                    render={({
                      field: {onChange, value},
                      fieldState: {error},
                    }) => (
                      <>
                        <TouchableOpacity
                          style={styles.uploadBox}
                          onPress={() => handleCNICBack(onChange)}>
                          {cnicBackLoader ? (
                            <ActivityIndicator size="large" color={'#EAA141'} />
                          ) : cnicBack ? (
                            <>
                              <TouchableOpacity
                                style={styles?.cross}
                                onPress={() => {
                                  removeCnicBack(cnicBack, onChange);
                                }}>
                                <Entypo
                                  name="circle-with-cross"
                                  size={width * 0.05}
                                  color={'red'}
                                />
                              </TouchableOpacity>
                              <Image
                                style={styles.cnicImage}
                                source={{
                                  uri: enviroment?.API_URL + cnicBack,
                                }}
                              />
                            </>
                          ) : (
                            <Ionicons
                              name="add"
                              size={width * 0.1}
                              color={'#EAA141'}
                            />
                          )}
                        </TouchableOpacity>
                        {error && (
                          <Text style={[styles?.error]}>{error?.message}</Text>
                        )}
                      </>
                    )}
                    name={'cnicBack'}
                  />
                </View>
              </View>
              <Text style={styles.sectionTitle}>
                Upload Bar Council Documents
              </Text>

              <View>
                <Controller
                  control={control}
                  rules={{required: 'Bar Council Documents is required'}}
                  render={({field: {onChange, value}, fieldState: {error}}) => (
                    <>
                      {barDocsLoader ? (
                        <ActivityIndicator size="large" color={'#EAA141'} />
                      ) : barDocs && barDocs?.length > 0 ? (
                        <>
                          <View style={styles.uploadContainer1}>
                            {barDocs?.map((item, index) => (
                              <TouchableOpacity
                                key={index}
                                style={styles.uploadBox1}>
                                <TouchableOpacity
                                  style={[styles?.cross, {left: width * 0.21}]}
                                  onPress={() => {
                                    removeBarDoc(item, onChange);
                                  }}>
                                  <Entypo
                                    name="circle-with-cross"
                                    size={width * 0.05}
                                    color={'red'}
                                  />
                                </TouchableOpacity>
                                <Image
                                  style={[
                                    styles.cnicImage,
                                    {width: width * 0.26},
                                  ]}
                                  source={{
                                    uri: enviroment?.API_URL + item,
                                  }}
                                />
                              </TouchableOpacity>
                            ))}
                          </View>
                        </>
                      ) : (
                        <TouchableOpacity
                          style={styles.uploadDocBox}
                          onPress={() => handleBarCouncilDoc(onChange)}>
                          <Ionicons
                            name="add"
                            size={width * 0.1}
                            color={'#EAA141'}
                          />
                        </TouchableOpacity>
                      )}
                      {error && (
                        <Text style={[styles?.error]}>{error?.message}</Text>
                      )}
                    </>
                  )}
                  name={'barCouncilDocument'}
                />
              </View>
            </>

            <TouchableOpacity
              disabled={loader ? true : false}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}>
              {loader ? (
                <ActivityIndicator color={'#0F5189'} />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>

            <View style={{alignItems: 'center'}}>
              <Text style={styles.orText}>OR</Text>

              <Text style={styles.footer}>
                Already have an account?{' '}
                <Text
                  style={styles.loginText}
                  onPress={() => navigation.goBack('Login')}>
                  Login
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
  },
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: width * 0.08,
    fontFamily: 'Marathon-Serial Bold',
    color: 'black',
    marginBottom: width * 0.06,
  },
  input: {
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: '#FFF',
    fontFamily: 'Poppins-Regular',
  },
  sectionTitle: {
    fontSize: width * 0.07,
    fontFamily: 'Marathon-Serial Regular',
    marginBottom: 20,
    color: '#A4A9AE',
  },
  uploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  parentBox: {
    width: '48%',
  },
  uploadBox: {
    height: width * 0.26,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: width * 0.048,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 4,
  },
  uploadBox1: {
    width: '30%',
    height: width * 0.35,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: width * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadDocBox: {
    height: width * 0.4,
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: width * 0.048,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  orText: {
    fontSize: 16,
    color: '#888',
    marginVertical: 20,
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
  error: {
    marginTop: 8,
    fontSize: width * 0.03,
    color: 'red',
    fontFamily: 'Poppins-Regular',
  },
  cnicImage: {
    width: width * 0.34,
    height: width * 0.24,
  },
  cross: {
    position: 'absolute',
    height: width * 0.27,
    zIndex: 999,
    left: width * 0.34,
  },
});
