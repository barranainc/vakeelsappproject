import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  PermissionsAndroid,
  Image,
} from 'react-native';
import {endpoints, urls} from '../../../services/Endpionts';
import {AppImages} from '../../../Utils/ImagesUrl';
import AppHeader from '../../../Components/AppHeader';
import {Controller, useForm} from 'react-hook-form';
import InputField from '../../../Components/textInputs/InputField';
import {getMultipleDocumentUrl, showToast} from '../../../helpers';
import DocumentPicker, {types} from 'react-native-document-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {enviroment} from '../../../environment';
import {Dropdown} from 'react-native-element-dropdown';
import {status} from './arrays';
import {apiCall} from '../../../services/apiCall';
import {SafeAreaView} from 'react-native-safe-area-context';
import DatePicker from '../../../Components/DatePicker';
import ImageSelectionModal from '../../../Components/modals/ImageSelectionModal';
const {width, height} = Dimensions.get('window');
export default function CaseProceeding({navigation, route}) {
  const {details} = route.params || '';
  const options = [
    {label: 'Next Hearing', value: 'next hearing'},
    {label: 'Case Concluded', value: 'concluding'},
  ];
  const [selectedOption, setSelectedOption] = useState({
    label: 'Next Hearing',
    value: 'next hearing',
  });
  const [loading, setLoading] = useState(true);
  const [attachmentLoader, setAttachmentLoader] = useState(false);
  const [hearingDate, setHearingDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [attachmentDocs, setAttachmentDocs] = useState([]); // Placeholder for multiple documents
  const {control, handleSubmit, watch} = useForm({
    defaultValues: {
      order: null,
      caseStatus: null,
    },
  });
  const removeAttachmentDocs = (itemId, onChange) => {
    // Use filter to create a new array without the item to be removed
    const updatedData = attachmentDocs?.filter(item => item !== itemId);
    // Update the state with the new array
    if (updatedData?.length === 0) {
      onChange(null);
    }
    setAttachmentDocs(updatedData);
  };
  const getDocument = async (document, docType, onChange) => {
    try {
      const multipleDocumentUrl = await getMultipleDocumentUrl(document);
      if (multipleDocumentUrl === 'Error uploading document') {
        showToast('error', 'Large file uploaded. File size must be in Kbs');
      } else {
        setAttachmentDocs(multipleDocumentUrl);
      }
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      // setCnicFrontLoader(false);
    }
  };
  const handleAttachmentDocs = useCallback(async onChange => {
    setModalVisible(false);
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
        setAttachmentLoader(true);
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
        setAttachmentLoader(false);
      }
    } else {
      alert('Camera permission denied');
      onChange(undefined);
    }
  }, []);

  const onSubmit = async data => {
    let obj = {
      case_id: details?._id,
      order: data?.order,
      attachments: attachmentDocs,
      status: selectedOption?.value, //next hearing or concluding
      next_hearing:
        selectedOption?.label === 'Next Hearing' ? hearingDate : null,
      case_status:
        selectedOption?.label !== 'Next Hearing' ? data?.caseStatus : null, //only in case of concluded
    };
    try {
      setLoading(true);
      let result = await apiCall?.caseProceeding(obj);
      showToast('success', result?.message);
      navigation?.navigate('GetAllCases');
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1, padding: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <AppHeader navigation={navigation} title="Case Proceeding" />

        <View style={styles.container}>
          <Text style={styles.title}>Input/Upload Proceeding</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.optionsContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    selectedOption?.value === option?.value &&
                      styles.selectedOption,
                  ]}
                  onPress={() => setSelectedOption(option)}>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedOption?.value === option?.value &&
                        styles.selectedCircle,
                    ]}>
                    <View
                      style={[
                        styles.subRadioCircle,
                        selectedOption?.value !== option?.value &&
                          styles.selectedCircle,
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      selectedOption?.value === option?.value &&
                        styles.selectedLabel,
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <InputField
              name={'order'}
              control={control}
              rules={{
                required: 'order of the day is required',
              }}
              placeholder={'Order Of The Day'}
            />

            <Text style={styles.title}>Attachments</Text>

            <View>
              <Controller
                control={control}
                rules={{required: 'Bar Council Documents is required'}}
                render={({field: {onChange, value}, fieldState: {error}}) => (
                  <>
                    <ImageSelectionModal
                      getDocument={getDocument}
                      onChange={onChange}
                      handleDoc={() => handleAttachmentDocs(onChange)}
                      modalVisible={modalVisible}
                      setModalVisible={setModalVisible}
                    />
                    {attachmentLoader ? (
                      <ActivityIndicator size="large" color={'#EAA141'} />
                    ) : attachmentDocs && attachmentDocs?.length > 0 ? (
                      <>
                        <View style={styles.uploadContainer1}>
                          {attachmentDocs?.map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              style={styles.uploadBox1}>
                              <TouchableOpacity
                                style={[styles?.cross, {left: width * 0.21}]}
                                onPress={() => {
                                  removeAttachmentDocs(item, onChange);
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
                        onPress={() => setModalVisible(!modalVisible)}>
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

              {selectedOption?.label !== 'Next Hearing' ? (
                <View>
                  <Controller
                    control={control}
                    rules={{required: 'Case status is required'}}
                    render={({
                      field: {onChange, value},
                      fieldState: {error},
                    }) => (
                      <>
                        <Dropdown
                          style={[styles.dropdown]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          iconStyle={styles.iconStyle}
                          data={status}
                          // search
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder={'Case Status'}
                          // searchPlaceholder="Search..."
                          value={value}
                          onChange={item => {
                            onChange(item.value);
                          }}
                        />

                        {error && (
                          <Text style={[styles?.error]}>{error?.message}</Text>
                        )}
                      </>
                    )}
                    name={'caseStatus'}
                  />
                </View>
              ) : (
                <View style={{marginTop: width * 0.04}}>
                  <DatePicker
                    date={hearingDate}
                    setDate={setHearingDate}
                    placeholder={'Hearing Date'}
                    name={'hearingDate'}
                    control={control}
                    //  value={hearingDate}
                    rules={{
                      required: 'Hearing date is required',
                    }}
                  />
                </View>
              )}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (loading || options.length === 0 || selectedOption === null) && {
                backgroundColor: '#EAA141',
              }, // Gray out when inactive
            ]}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Marathon-Serial Bold',
    color: '#A4A9AE',
    marginBottom: 20,
    textAlign: 'left',
  },
  optionsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#D1D3D4',
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  selectedOption: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D3D4',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subRadioCircle: {
    width: 16,
    height: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#EAA141',
    // marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCircle: {
    borderColor: '#FFF',
    backgroundColor: '#FFF',
  },
  optionLabel: {
    fontSize: 16,
    color: '#555',
    textAlign: 'left',
    flex: 1,
  },
  selectedLabel: {
    color: '#FFF',
    fontWeight: '600',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#EAA141',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    fontSize: 16,
    color: '#A4A9AE',
    textAlign: 'center',
    marginVertical: 20,
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
  cross: {
    position: 'absolute',
    height: width * 0.27,
    zIndex: 999,
    left: width * 0.34,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 18,
    paddingHorizontal: 15,
    marginTop: width * 0.04,
  },
  label: {
    width: '97%',
    fontSize: 14,
    backgroundColor: '#FFF',
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#747474',
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  error: {
    paddingHorizontal: 15,
    fontSize: width * 0.03,
    color: 'red',
    fontFamily: 'Poppins-Regular',
    top: width * 0.02,
  },
  cnicImage: {
    width: width * 0.34,
    height: width * 0.24,
  },
});
