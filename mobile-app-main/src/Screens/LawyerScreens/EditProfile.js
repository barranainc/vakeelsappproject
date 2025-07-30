import React, {useCallback, useEffect, useState} from 'react';
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
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import InputField from '../../Components/textInputs/InputField';
import DocumentPicker, {types} from 'react-native-document-picker';
import axios from 'axios';
import {useForm, Controller} from 'react-hook-form';
import {enviroment} from '../../environment';
import {Apis} from '../../services/Endpoints';
import {
  getDataLocally,
  getDocumentUrl,
  getMultipleDocumentUrl,
  requestCameraPermission,
  showToast,
} from '../../helpers';
import {apiCall} from '../../services/apiCall';
import AppHeader from '../../Components/AppHeader';
const {width, height} = Dimensions.get('window');
export default function EditLawyerProfile({navigation, route}) {
  const [profilePic, setProfilePic] = useState(null);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePicLoader, setProfilePicLoader] = useState(false);
  const {control, handleSubmit, watch, setValue} = useForm({
    defaultValues: {
      designation: null,
      experience: null,
      qualification: null,
      station: null,
      officeAddress: null,
      areaOfExpertise: null,
    },
  });
  const getInitialData = async () => {
    const getLocalData = await getDataLocally();
    let obj = {
      user_id: getLocalData?._id,
    };
    try {
      setLoading(true);
      let result = await apiCall?.getProfile(obj);
      setValue(
        'designation',
        result?.data?.userDetails?.lawyer_details?.designation
          ? result?.data?.userDetails?.lawyer_details?.designation
          : null,
      );
      setValue(
        'experience',
        result?.data?.userDetails?.lawyer_details?.years_of_experience
          ? result?.data?.userDetails?.lawyer_details?.years_of_experience
          : null,
      );
      setValue(
        'qualification',
        result?.data?.userDetails?.lawyer_details?.qualifications
          ? result?.data?.userDetails?.lawyer_details?.qualifications
          : null,
      );
      setValue(
        'station',
        result?.data?.userDetails?.lawyer_details?.station
          ? result?.data?.userDetails?.lawyer_details?.station
          : null,
      );
      setValue(
        'officeAddress',
        result?.data?.userDetails?.lawyer_details?.office_address
          ? result?.data?.userDetails?.lawyer_details?.office_address
          : null,
      );
      setValue(
        'areaOfExpertise',
        result?.data?.userDetails?.lawyer_details?.area_of_expertise
          ? result?.data?.userDetails?.lawyer_details?.area_of_expertise
          : null,
      );
      setProfilePic(
        result?.data?.userDetails?.picture
          ? result?.data?.userDetails?.picture
          : null,
      );
      setLoading(false);
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
      console.log('error', error);
    } finally {
    }
  };
  useEffect(() => {
    getInitialData();
  }, []);
  const onSubmit = async data => {
    let obj = {
      designation: data?.designation,
      years_of_experience: data?.experience,
      qualifications: data?.qualification,
      station: data?.station,
      office_address: data?.officeAddress,
      area_of_expertise: data?.areaOfExpertise,
      picture: profilePic,
    };
    console.log('obj', obj);
    try {
      setLoader(true);
      let result = await apiCall?.updateLawyerProfile(obj);
      showToast('success', result?.message);
      navigation?.goBack();
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };
  const handleProfilePic = useCallback(async onChange => {
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
        setProfilePicLoader(true);
        const response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        });
        // setProfilePic(response);
        await getDocument(response, 'profilePic');
        onChange(response);
      } catch (err) {
        onChange(undefined);
      } finally {
        setProfilePicLoader(false);
      }
    } else {
      // alert('Camera permission denied');
      const againPermission = requestCameraPermission();
      onChange(undefined);
    }
  }, []);

  const getDocument = async (document, docType) => {
    try {
      // setProfilePicLoader(true);
      const docUrl = await getDocumentUrl(document);
      if (docType === 'profilePic') {
        if (docUrl === 'Error uploading document') {
          showToast('error', 'Large file uploaded. File size must be in Kbs');
        } else {
          setProfilePic(docUrl);
        }
      }
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      // setProfilePicLoader(false);
    }
  };
  const removeProfilePic = (itemId, onChange) => {
    // Use filter to create a new array without the item to be removed
    setProfilePic(null);
    onChange(null);
  };
  if (loading) {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#2669A9" />
      </SafeAreaView>
    );
  }
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
        <AppHeader navigation={navigation} title="Update Profile" />
        <ScrollView
          contentContainerStyle={[
            styles.container,
            {paddingBottom: 20, flexGrow: 1},
          ]}
          keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            onPress={() => handleProfilePic()}
            style={styles.profileView}>
            {profilePicLoader ? (
              <ActivityIndicator size="large" color={'#EAA141'} />
            ) : profilePic ? (
              <>
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: enviroment?.API_URL + profilePic,
                  }}
                />
              </>
            ) : (
              <Feather name="camera" size={width * 0.12} color={'white'} />
            )}
          </TouchableOpacity>

          <View style={{marginTop: width * 0.14}}>
            <InputField
              name={'designation'}
              control={control}
              rules={{
                required: 'Designation is required',
              }}
              placeholder={'Designation'}
            />
            <InputField
              name={'experience'}
              control={control}
              rules={{
                required: 'Experience is required',
              }}
              placeholder={'Experience'}
            />
            <InputField
              name={'qualification'}
              control={control}
              rules={{
                required: 'Qualification is required',
              }}
              placeholder={'Qualification'}
            />
            <InputField
              name={'station'}
              control={control}
              rules={{
                required: 'Station is required',
                // validate: emailValidation,
              }}
              placeholder={'Station'}
            />
            <InputField
              name={'areaOfExpertise'}
              control={control}
              rules={{
                required: 'Area of expertise  is required',
              }}
              placeholder={'Area Of Expertise'}
              // numpad
            />
            <InputField
              name={'officeAddress'}
              control={control}
              rules={{
                required: 'Office Address is required',
              }}
              placeholder={'Office Address'}
              // numpad
            />
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={loader?true:false}
              style={styles.submitButton}>
              {loader ? (
                <ActivityIndicator color={'#0F5189'} />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
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
    flexWrap:"wrap",
    gap:4
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
    marginTop: 10,
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
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cross: {
    position: 'absolute',
    height: width * 0.27,
    zIndex: 999,
    left: width * 0.34,
  },
  profileView: {
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 10,
    backgroundColor: '#D1D3D4',
    width: width * 0.4,
    height: width * 0.4,
    alignSelf: 'center',
    borderRadius: width * 0.3,
    overflow: 'hidden',
  },
});
