import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import DocumentPicker, {types} from 'react-native-document-picker';
import axios from 'axios';
import {useForm, Controller} from 'react-hook-form';
import {apiCall} from '../../../services/apiCall';
import {
    getDataLocally,
  getDocumentUrl,
  getMultipleDocumentUrl,
  showToast,
} from '../../../helpers';
import {AppImages} from '../../../Utils/ImagesUrl';
import {enviroment} from '../../../environment';
import AppHeader from '../../../Components/AppHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
const {width, height} = Dimensions.get('window');
export default function AddTeam2({navigation,route}) {
  const {data} = route?.params||''
  const [barDocs, setBarDocs] = useState([]);
  const [ProfessionalDocs, setProfessionalDocs] = useState([]);
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loader, setLoader] = useState(false);
  const [cnicFrontLoader, setCnicFrontLoader] = useState(false);
  const [profilePictureLoader, setProfilePictureLoader] = useState(false);
  const [cnicBackLoader, setCnicBackLoader] = useState(false);
  const [barDocsLoader, setBarDocsLoader] = useState(false);
  const [professionalDocsLoader, setProffesionalDocsLoader] = useState(false);
  const {control, handleSubmit, watch} = useForm({
  });
  const onSubmit = async (value) => {
    const lawyerData = await getDataLocally()
    let obj = {
        first_name: data.firstName,
        last_name: data.lastName,
        council_id: data.barCouncilId,
        email:data.email,
        phone: data.phone,
        cnic_number:data.cnic,
        cnic_front:cnicFront,
        cnic_back:cnicBack,
        picture: profilePicture,
        user_type: data?.user_type?.value,  //student, associate
        lawyer_details: {
            professional_documents: ProfessionalDocs,
            council_documents: barDocs,
            city: lawyerData?.lawyer_details?.city,
            office_address: lawyerData?.lawyer_details?.office_address,
            area_of_expertise: lawyerData?.lawyer_details?.area_of_expertise,
            years_of_experience: lawyerData?.lawyer_details?.years_of_experience,
            qualifications:lawyerData?.lawyer_details?.qualifications,
            designation:lawyerData?.lawyer_details?.designation,
            station:lawyerData?.lawyer_details?.station,
        }
    }
    try {
      setLoader(true);
      let result = await apiCall?.addMember(obj);
      showToast('success', result?.message);
      navigation?.navigate('Teams');
    } catch (error) {
        console.log("error",error)
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
      alert('Camera permission denied');
      onChange(undefined);
    }
  }, []);
  const handleProfilePicture = useCallback(async onChange => {
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
        setProfilePictureLoader(true);
        const response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        });
        // setCnicFront(response);
        await getDocument(response, 'profilePicture');
        onChange(response);
      } catch (err) {
        onChange(undefined);
      } finally {
        setProfilePictureLoader(false);
      }
    } else {
      alert('Camera permission denied');
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
      alert('Camera permission denied');
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
      alert('Camera permission denied');
      onChange(undefined);
    }
  }, []);

  const handleProfessionalDocs = useCallback(async onChange => {
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
        setProffesionalDocsLoader(true);
        const response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          allowMultiSelection: true,
          type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        });
        // setCnicBack(response);
        await getDocument(response, 'professionalDocs', onChange);
        onChange(response);
      } catch (err) {
        onChange(undefined);
      } finally {
        setProffesionalDocsLoader(false);
      }
    } else {
      alert('Camera permission denied');
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
      } else if (docType === 'profilePicture') {
        if (docUrl === 'Error uploading document') {
          showToast('error', 'Large file uploaded. File size must be in Kbs');
        } else {
          setProfilePicture(docUrl);
        }
      } else if (docType === 'professionalDocs') {
        const multipleDocumentUrl = await getMultipleDocumentUrl(document);
        if (multipleDocumentUrl === 'Error uploading document') {
          showToast('error', 'Large file uploaded. File size must be in Kbs');
        } else {
          setProfessionalDocs(multipleDocumentUrl);
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
  const removeProfessionalDocs = (itemId, onChange) => {
    // Use filter to create a new array without the item to be removed
    const updatedData = ProfessionalDocs?.filter(item => item !== itemId);
    // Update the state with the new array
    if (updatedData?.length === 0) {
      onChange(null);
    }
    setProfessionalDocs(updatedData);
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
        <AppHeader navigation={navigation} title="Add Team" progress={'2/2'} />
        <ScrollView
          contentContainerStyle={[
            styles.container,
            {paddingBottom: 20, flexGrow: 1},
          ]}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionTitle}>User Profile Picture</Text>

          <Controller
            control={control}
            rules={{required: 'Profile picture is required'}}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <>
                <TouchableOpacity
                  style={styles.profileImageView}
                  onPress={() => handleProfilePicture(onChange)}>
                  {!profilePicture ? (
                    <Feather
                      name="camera"
                      size={width * 0.1}
                      color={'#F4F6F8'}
                    />
                  ) : profilePictureLoader ? (
                    <ActivityIndicator size="large" color={'#EAA141'} />
                  ) : (
                    <Image
                      resizeMode="cover"
                      source={{
                        uri: enviroment?.API_URL + profilePicture,
                      }}
                      style={{width: width * 0.3, height: width * 0.3}}
                    />
                  )}
                </TouchableOpacity>
                {error && (
                  <Text style={[styles?.error, {textAlign: 'center'}]}>
                    {error?.message}
                  </Text>
                )}
              </>
            )}
            name={'profilePicture'}
          />

          <View style={{marginTop: width * 0.1}}>
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

              <View style={{marginVertical: width * 0.08}}>
                <Text style={styles.sectionTitle}>
                  Upload Professional Documents
                </Text>

                <View>
                  <Controller
                    control={control}
                    rules={{required: 'Professional Documents is required'}}
                    render={({
                      field: {onChange, value},
                      fieldState: {error},
                    }) => (
                      <>
                        {professionalDocsLoader ? (
                          <ActivityIndicator size="large" color={'#EAA141'} />
                        ) : ProfessionalDocs && ProfessionalDocs?.length > 0 ? (
                          <>
                            <View style={styles.uploadContainer1}>
                              {ProfessionalDocs?.map((item, index) => (
                                <TouchableOpacity
                                  key={index}
                                  style={styles.uploadBox1}>
                                  <TouchableOpacity
                                    style={[
                                      styles?.cross,
                                      {left: width * 0.21},
                                    ]}
                                    onPress={() => {
                                      removeProfessionalDocs(item, onChange);
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
                            onPress={() => handleProfessionalDocs(onChange)}>
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
                    name={'professionalDocs'}
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
              onPress={handleSubmit(onSubmit)}
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
  profileImageView: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#D1D3D4',
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.3,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: width * 0.04,
    overflow: 'hidden',
  },
});
