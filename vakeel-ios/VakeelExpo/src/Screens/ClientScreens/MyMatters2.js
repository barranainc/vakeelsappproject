import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Dimensions,
  ScrollView,
  Image,
  BackHandler,
} from 'react-native';
import AppHeader from '../../Components/AppHeader';
import {AppImages} from '../../Utils/ImagesUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {showToast} from '../../helpers';
import {SafeAreaView} from 'react-native-safe-area-context';
import {enviroment} from '../../environment';
import {apiCall} from '../../services/apiCall';
import {ActivityIndicator} from 'react-native';
import SocketServices from '../../services/sockets/SocketServices';
import {useIsFocused} from '@react-navigation/native';
import ReasonModal from '../../Components/modals/ReasonModal';

const {width} = Dimensions.get('window');

export default function MyMatters2({navigation, route}) {
  const [loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {MatterDetails, type} = route.params || {};
  const fucus = useIsFocused();
console.log("type",type)
  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  };
  const onSubmit = async () => {
    let obj = {
      client_id: MatterDetails?.client_id,
      type: 'client_matter', //client_matter,client_request
      type_id: MatterDetails?._id, //_id of matter or request
      type_name: MatterDetails?.title, //Name of matter or request
    };
    try {
      setLoader(true);
      SocketServices.connect('connect', () => {});
      let result = await apiCall?.postMatterRequest(obj);
      let result1 = await apiCall?.updateMatterStatus({
        id: MatterDetails?._id,
        is_interested: true,
      });
      navigation.navigate('IndividualChat', {
        id: result.data?.room_id,
        details: MatterDetails,
        defaultMessage:true
      });
      console.log('matter Request', result);
    } catch (error) {
      console.log('error', error);
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };
 useEffect(() => {
    const backAction = () => {
      if(type=='Lawyer'){
        navigation?.navigate("Home")
      }else{
        navigation?.navigate("ClientHome")
      }
    
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1, padding: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <AppHeader navigation={navigation} title="Matter Details" />

        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{paddingVertical: 10}}>
            <ReasonModal
              visible={modalVisible}
              onSubmit={reason => {
                console.log('Submitted Reason:', reason);
                setModalVisible(false);
              }}
              detail={MatterDetails}
              onCancel={() => setModalVisible(false)}
            />
            <View style={styles.card}>
              <View style={[styles.cardHeader, {flexDirection: 'row'}]}>
                <View
                  style={{
                    width: '20%',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#2669A9',
                      borderRadius: 50,
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <Image
                      resizeMode="contain"
                      source={{
                        uri:
                          enviroment?.API_URL + MatterDetails?.category?.icon,
                      }}
                      style={{height: 30, width: 30, tintColor: '#fff'}}
                    />
                  </View>
                </View>

                <View style={{width: '80%', marginLeft: 5}}>
                  <Text style={styles.cardTitle}>{MatterDetails?.title}</Text>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <Text style={styles.cardCategory}>
                      {MatterDetails?.category?.name +
                        '/' +
                        MatterDetails?.subcategory?.name}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.cardDescription}>
                {MatterDetails?.description}
              </Text>
              <View style={styles.cardFooter}>
                <View style={{flexDirection: 'row'}}>
                  <Ionicons name="calendar-outline" size={16} color="#A9A9A9" />
                  {/* <Text style={styles.cardDate}>{'MatterDetails?.date'}</Text> */}
                  <Text style={styles.cardDate}>
                    {formatDate(MatterDetails?.created_at)}
                  </Text>
                </View>
                <Text style={styles.cardResponses}>
                  {`${
                    MatterDetails?.responded_lawyer
                      ? MatterDetails?.responded_lawyer
                      : 0
                  } Lawyers Responded`}
                </Text>
              </View>
            </View>
          </ScrollView>
          {type === 'Lawyer' && MatterDetails?.respond == null ? (
            <>
              <TouchableOpacity
                style={[styles.submitButton, {marginBottom: 0}]}
                onPress={() => onSubmit()}>
                {loader ? (
                  <ActivityIndicator color={'#0F5189'} />
                ) : (
                  <Text style={styles.submitButtonText}>Respond</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, {backgroundColor: '#5491C9'}]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.submitButtonText}>Not Interested</Text>
              </TouchableOpacity>
            </>
          ) : (
            // <TouchableOpacity
            //   style={styles.submitButton}
            //   onPress={() =>
            //     navigation.navigate('CreateMatter3', {
            //       MatterDetails: MatterDetails,
            //     })
            //   }>
            //   <Text style={styles.submitButtonText}>Edit Details</Text>
            // </TouchableOpacity>
            <></>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#1C5A9A',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    // backgroundColor: '#FFF',
  },
  chipSelected: {
    backgroundColor: '#1C5A9A',
  },
  chipText: {
    fontSize: 14,
    color: '#337DBD',
  },
  chipTextSelected: {
    color: '#FFF',
  },
  card: {
    // backgroundColor: '#FFFFFF',
    // borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 5,
    // borderWidth: 1,
    // borderColor: '#E5E5E5',
  },
  cardHeader: {
    marginBottom: 5,
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#1C5A9A',
    // marginBottom: 4,
  },
  cardCategory: {
    fontSize: 11,
    color: '#EAA141',
    fontFamily: 'Poppins-Regular',
  },
  cardDescription: {
    fontSize: 12,
    color: '#777',
    fontFamily: 'Poppins-Regular',
    marginVertical: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#1C5A9A',
    borderTopWidth: 0.3,
    paddingTop: 5,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 3,
  },
  cardResponses: {
    fontSize: 12,
    color: '#5491C9',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.04,
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});
