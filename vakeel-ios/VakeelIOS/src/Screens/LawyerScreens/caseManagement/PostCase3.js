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
import DocumentPicker, {types} from 'react-native-document-picker';
import axios from 'axios';
import {useForm, Controller} from 'react-hook-form';
import {
  getDocumentUrl,
  getMultipleDocumentUrl,
  showToast,
} from '../../../helpers';
import {AppImages} from '../../../Utils/ImagesUrl';
import InputField from '../../../Components/textInputs/InputField';
import {enviroment} from '../../../environment';
import AppHeader from '../../../Components/AppHeader';
import {apiCall} from '../../../services/apiCall';
import {Dropdown} from 'react-native-element-dropdown';
import {decisionType, party, status, years} from './arrays';
import DatePicker from '../../../Components/DatePicker';
import {SafeAreaView} from 'react-native-safe-area-context';
import SearchBar from '../../../Components/SearchBar';
const {width, height} = Dimensions.get('window');
export default function PostCase3({navigation, route}) {
  const [caseDocs, setCaseDocuments] = useState([]); // Placeholder for multiple documents
  const [loader, setLoader] = useState(false);
  const [hearingDate, setHearingDate] = useState(new Date());
  const [decisionDate, setDecisionDate] = useState(new Date());
  const [caseDocsLoader, setCaseDocumentsLoader] = useState(false);
  const [prevCaseSearch, setPrevCaseSearch] = useState();
  const [prevCase, setPrevCase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const {category_id} = route?.params || '';
  const {subCategory_id} = route?.params || '';
  const {control, handleSubmit} = useForm({
    defaultValues: {
      party: null,
      clientName: null,
      title: null,
      caseDescription: null,
      hearingDate: null,
      caseStatus: null,
      firNo: null,
      firYear: null,
      policeStation: null,
      offence: null,
      decidedBy: null,
      decisionDate: null,
      decisionType: null,
      acquitted: null,
      caseCategory: null,
      shortOrder: null,
    },
  });
  const getAllCases = async id => {
    setCases([]);
    let obj = {
      limit: 1000,
      case_number: id,
    };
    try {
      setLoading(true);
      let result = await apiCall?.getAllCases(obj);
      setCases(result?.data?.cases);
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async data => {
    const ids = prevCase.map(item => item?._id);
    let obj = {
      category_id: category_id, // Family category
      subcategory_id: subCategory_id, // will be change
      party_1: data?.party,
      client_name: data?.clientName,
      title: data?.title,
      case_description: data?.caseDescription,
      hearing_date: hearingDate,
      case_status: data?.caseStatus,
      case_number: data?.caseNo,
      FIR_number: data?.firNo,
      FIR_year: data?.firYear,
      police_station: data?.policeStation,
      offense: data?.offence,
      case_category: data?.caseCategory, // will be implement
      case_documents: caseDocs,
      disposal_decided_by: data?.decidedBy,
      decision_type: data?.decisionType,
      decision_date: decisionDate,
      acquitted_convicted: data?.acquitted, //or convicted
      short_order: data?.shortOrder,
      previous_refs:prevCase?.length>0?ids:null
    };
    try {
      setLoader(true);
      let result = await apiCall?.postCase(obj);
      // showToast('success', result?.message);
      navigation.navigate('SuccessScreen', {
        SuccessMessage: {
          successTitle: 'Case Added',
          successMsg: 'Case Added Successfully',
          scrrenName: 'Home',
        },
      });
    } catch (error) {
      console.log('error', error);
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  const handleCaseDoc = useCallback(async onChange => {
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
        setCaseDocumentsLoader(true);
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
        setCaseDocumentsLoader(false);
      }
    } else {
      alert('Camera permission denied');
      onChange(undefined);
    }
  }, []);
  const getDocument = async (document, docType) => {
    try {
      // setCnicFrontLoader(true);
      const multipleDocumentUrl = await getMultipleDocumentUrl(document);
      if (multipleDocumentUrl === 'Error uploading document') {
        showToast('error', 'Large file uploaded. File size must be in Kbs');
      } else {
        setCaseDocuments(multipleDocumentUrl);
      }
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      // setCnicFrontLoader(false);
    }
  };
  const removeCaseDoc = (itemId, onChange) => {
    // Use filter to create a new array without the item to be removed
    const updatedData = caseDocs?.filter(item => item !== itemId);
    // Update the state with the new array
    if (updatedData?.length === 0) {
      onChange(null);
    }
    setCaseDocuments(updatedData);
  };
  const selectPrevCase = (item) => {
    setPrevCase((prevState) => {
      // Check if the item is already selected (avoid duplicates)
      if (!prevState.some((selectedItem) => selectedItem._id === item._id)) {
        return [...prevState, item]; // Add the item to the state array
      }
      return prevState; // If the item is already selected, don't change the state
    });
    setCases([])
  };
console.log("prevcase",prevCase?._id)
  // Function to handle removing an item
  const removeItem = (itemId) => {
    setPrevCase((prevState) => {
      return prevState.filter((item) => item._id !== itemId); // Remove item based on id
    });
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}

      {/* <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}> */}
      <ImageBackground
        source={AppImages.Login_Bg}
        style={{flex: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <AppHeader navigation={navigation} title="Add Case" progress="3/3" />
        <ScrollView
          contentContainerStyle={[
            styles.container,
            {paddingBottom: 20, flexGrow: 1},
          ]}
          keyboardShouldPersistTaps="handled">
          <View>
            <Text style={styles.sectionTitle}>Case Details</Text>
            <View>
              <Controller
                control={control}
                rules={{required: 'Party is required'}}
                render={({field: {onChange, value}, fieldState: {error}}) => (
                  <>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={party}
                      // search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={'Party'}
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
                name={'party'}
              />
            </View>

            <InputField
              name={'clientName'}
              control={control}
              rules={{
                required: 'Client Name is required',
              }}
              placeholder={'Client Name'}
            />
            <InputField
              name={'title'}
              control={control}
              rules={{
                required: 'Title is required',
                //   validate: emailValidation,
              }}
              placeholder={'Title'}
            />
            <InputField
              name={'caseDescription'}
              control={control}
              rules={{
                required: 'Case description is required',
              }}
              placeholder={'Case Description'}
              isMultiple
            />
            {/* <InputField
                name={'hearingDate'}
                control={control}
                rules={{
                  required: 'Hearing date is required',
                }}
                placeholder={'Hearing Date'}
                numpad
              /> */}
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
            <View>
              <Controller
                control={control}
                rules={{required: 'Case status is required'}}
                render={({field: {onChange, value}, fieldState: {error}}) => (
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
            <InputField
              name={'caseNo'}
              control={control}
              rules={{
                required: 'Case No. is required',
              }}
              placeholder={'Case No.'}
            />
            <InputField
              name={'caseCategory'}
              control={control}
              rules={{
                required: 'Case category is required',
              }}
              placeholder={'Case Category'}
            />
            <InputField
              name={'firNo'}
              control={control}
              rules={{
                required: 'FIR No. is required',
              }}
              placeholder={'FIR No.'}
            />

            <View>
              <Controller
                control={control}
                rules={{required: 'FIR year is required'}}
                render={({field: {onChange, value}, fieldState: {error}}) => (
                  <>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={years}
                      // search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={'Fir Year'}
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
                name={'firYear'}
              />
            </View>
            <InputField
              name={'policeStation'}
              control={control}
              rules={{
                required: 'Police station is required',
              }}
              placeholder={'Police Station'}
              // numpad
            />
            <InputField
              name={'offence'}
              control={control}
              rules={{
                required: 'Offence is required',
              }}
              placeholder={'Offence'}
            />

            <Text style={styles.sectionTitle}>Previous Case Ref</Text>
            <SearchBar
              func={getAllCases}
              value={prevCaseSearch}
              onChangeText={setPrevCaseSearch}
              placeholder={'Search'}
              // onPress={() => {
              //   getVehicle(prevCaseSearch);
              // }}
            />
           {cases?.length>0&& 
           <ScrollView
              contentContainerStyle={styles?.prevCaseContainer}>
              {cases?.map(item => (
                <Text onPress={()=>{
                  selectPrevCase(item)
                }} style={[styles?.prevCaseInput]}>{item?.client_name}</Text>
              ))}
            </ScrollView>}
           
            {prevCase?.map(item => (
               <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between", paddingEnd: 12,}}>
                <Text style={styles?.prevCaseInput1}>{item?.client_name}</Text>
                 <Entypo onPress={()=>{
                  removeItem(item?._id)
                 }} name="cross" size={width * 0.06} color={'#5491C9'} />
                 </View>
              ))}
           
            <Text style={styles.sectionTitle}>Disposal Details</Text>
            <InputField
              name={'decidedBy'}
              control={control}
              rules={{
                required: 'Decided by is required',
              }}
              placeholder={'Decided By'}
            />
            <DatePicker
              date={decisionDate}
              setDate={setDecisionDate}
              placeholder={'Hearing Date'}
              name={'hearingDate'}
              control={control}
              //  value={hearingDate}
              rules={{
                required: 'Decision date is required',
              }}
            />
            <View>
              <Controller
                control={control}
                rules={{required: 'Decision type is required'}}
                render={({field: {onChange, value}, fieldState: {error}}) => (
                  <>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={decisionType}
                      // search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={'Decision type'}
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
                name={'decisionType'}
              />
            </View>
            <InputField
              name={'acquitted'}
              control={control}
              rules={{
                required: 'Acquitted/ Convicted is required',
              }}
              placeholder={'Acquitted/ Convicted'}
            />
            <InputField
              name={'shortOrder'}
              control={control}
              rules={{
                required: 'Short Order is required',
              }}
              placeholder={'Short Order'}
            />

            <>
              <Text style={styles.sectionTitle}>Upload Case Documents</Text>

              <View>
                <Controller
                  control={control}
                  rules={{required: 'Case Documents is required'}}
                  render={({field: {onChange, value}, fieldState: {error}}) => (
                    <>
                      {caseDocsLoader ? (
                        <ActivityIndicator size="large" color={'#EAA141'} />
                      ) : caseDocs && caseDocs?.length > 0 ? (
                        <>
                          <View style={styles.uploadContainer1}>
                            {caseDocs?.map((item, index) => (
                              <TouchableOpacity
                                key={index}
                                style={styles.uploadBox1}>
                                <TouchableOpacity
                                  style={[styles?.cross, {left: width * 0.21}]}
                                  onPress={() => {
                                    removeCaseDoc(item, onChange);
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
                          onPress={() => handleCaseDoc(onChange)}>
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
                  name={'caseDoc'}
                />
              </View>
            </>

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
    color: '#A4A9AE',
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
  error: {
    paddingHorizontal: 15,
    fontSize: width * 0.03,
    color: 'red',
    fontFamily: 'Poppins-Regular',
    bottom: width * 0.02,
  },
  //dropdown style
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
    marginBottom: width * 0.04,
  },
  icon: {
    marginRight: 5,
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
  prevCaseInput:{  width: '97%',
    fontSize: 14,
    backgroundColor: '#FFF',
    fontFamily: 'Poppins-Regular',
    color:'#000',
    marginVertical:4
  },
  prevCaseContainer:{
    paddingVertical: width * 0.04,
    backgroundColor: '#fff',
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 18,
    marginVertical: width * 0.02,
    paddingHorizontal:15
  },
  prevCaseInput1:{  width: '97%',
    fontSize: 18,
    backgroundColor: '#FFF',
    fontFamily: 'Poppins-Regular',
    color:'#5491C9',
    marginVertical:4
  },
});
