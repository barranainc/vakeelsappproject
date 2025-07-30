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
import {Controller, useForm} from 'react-hook-form';
import DocumentPicker, {types} from 'react-native-document-picker';
import {AppImages} from '../../../Utils/ImagesUrl';
import AppHeader from '../../../Components/AppHeader';
import InputField from '../../../Components/textInputs/InputField';
import {SafeAreaView} from 'react-native-safe-area-context';
const {width, height} = Dimensions.get('window');
export default function EditTeam1({navigation, route}) {
  const {details} = route.params || '';
  console.log('details', details);
  const options = [
    {label: 'Associate', value: 'associate'},
    {label: 'Paralegal', value: 'paralegal'},
    {label: 'Student', value: 'student'},
  ];
  const [selectedOption, setSelectedOption] = useState({
    label:
      details?.user_type?.charAt(0).toUpperCase() +
      details?.user_type?.slice(1),
    value: details?.user_type,
  });
  const [loading, setLoading] = useState(true);
  const {control, handleSubmit, setValue} = useForm({
    defaultValues: {
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      cnic: null,
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
      user_type: selectedOption,
      ...data,
      details:details
    };
    navigation.navigate('EditTeam2', {data: obj});
  };
  useEffect(() => {
    setValue('firstName', details?.first_name);
    setValue('lastName', details?.last_name);
    setValue('email', details?.email);
    setValue('phone', details?.phone);
    setValue('cnic', details?.cnic_number);
    setValue('barCouncilId', details?.council_id);
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1, padding: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <AppHeader navigation={navigation} title="Edit Team" progress={'1/2'} />
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>User Type</Text>
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
            <Text style={styles.title}>User Info</Text>
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
              disable
              name={'email'}
              control={control}
              rules={{
                required: 'Email is required',
                validate: emailValidation,
              }}
              placeholder={'Email'}
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
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (loading || options.length === 0 || selectedOption === null) && {
                backgroundColor: '#EAA141',
              }, // Gray out when inactive
            ]}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitButtonText}>Next</Text>
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
});
