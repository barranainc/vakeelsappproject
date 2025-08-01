import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AppHeader from '../../Components/AppHeader';
import {AppImages} from '../../Utils/ImagesUrl';
import {apiCall} from '../../services/apiCall';
import {showToast} from '../../helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');

export default function AddRequest3({navigation, route}) {
  const {MatterDetails} = route.params || {};
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (MatterDetails) {
      setTitle(MatterDetails?.title);
      setDescription(MatterDetails?.description);
    }
  }, [MatterDetails]);
  const onSubmit = async () => {
    let obj = {
      service_id: MatterDetails?.service_id, // Family category
      request_type: MatterDetails?.type,
      title: title,
      description: description,
      sub_service_id:MatterDetails?.sub_service_id?MatterDetails?.sub_service_id:null

    };
    console.log("obj",obj)
    try {
      setLoader(true);
      if (!title) {
        showToast('error', 'title is required');
      } else if (!description) {
        showToast('error', 'description is required');
      } else {
        let result = await apiCall?.postRequest(obj);
        navigation.navigate('SuccessScreen', {
          SuccessMessage: {
            successTitle: 'Your request has been posted successfully',
            successMsg: null,
            scrrenName: 'ClientHome',
          },
        });
      }
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1, padding: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <AppHeader
          navigation={navigation}
          title="Paralegal Assistance"
          progress="3/3"
        />
        <View style={styles.container}>
          <Text style={styles.title}>Describe Your Need</Text>
          <Text style={styles.title2}>Selected Document</Text>
          <Text style={styles.title3}>{MatterDetails?.serviceName}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#A4A9AE"
              value={title}
              onChangeText={text => setTitle(text)}
            />

            {/* Description Input */}
            <TextInput
              style={styles.textArea}
              placeholder="Describe your requirements"
              placeholderTextColor="#A4A9AE"
              value={description}
              onChangeText={text => setDescription(text)}
              multiline
              numberOfLines={50}
            />
          </ScrollView>
          <TouchableOpacity
          disabled={loader?true:false}
          style={styles.submitButton} onPress={onSubmit}>
            {loader ? (
              <ActivityIndicator color={'#0F5189'} />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
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
    fontSize: 22,
    fontFamily: 'Marathon-Serial Regular',
    color: '#A4A9AE',
    marginBottom: 20,
  },
  title2: {
    fontSize: 22,
    fontFamily: 'Marathon-Serial Regular',
    color: '#A4A9AE',
  },
  title3: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#0F5189',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D3D4',
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    height: height / 2, // Adjust based on screen size
    borderWidth: 1,
    borderColor: '#D1D3D4',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
