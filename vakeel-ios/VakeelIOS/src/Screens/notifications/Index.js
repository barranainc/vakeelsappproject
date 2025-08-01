import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppHeader from '../../Components/AppHeader';
import {AppImages} from '../../Utils/ImagesUrl';
import {apiCall} from '../../services/apiCall';
import SocketServices from '../../services/sockets/SocketServices';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getDataLocally} from '../../helpers';
import {useIsFocused} from '@react-navigation/native';
const {width} = Dimensions.get('window');
import { Swipeable } from 'react-native-gesture-handler';
import Delete from 'react-native-vector-icons/MaterialCommunityIcons';


const Notifications = ({navigation}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoader, setChatLoader] = useState(false);
  const focus = useIsFocused();
  useEffect(() => {
    const backAction = () => {
      navigation?.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  const getNotifications = async () => {
    setNotifications([]);
    try {
      setLoading(true);
      let result = await apiCall?.getAllNotifications();
      setNotifications(result?.data?.notifications);
    } catch (error) {
      console.log('error', error ? error : 'Something went wrong');
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getNotifications();
  }, [focus]);
  const handlePress = async item => {
    console.log("roomId",item)
    let roomId = null;

    try {
      const parsedData = JSON.parse(item.data);
      roomId = parsedData?.room_id || null;
    } catch (e) {
      roomId = null;
    }
    console.log("roomId",roomId)
    const getLocalData = await getDataLocally();
    if (roomId) {
      try {
        setChatLoader(true)
        SocketServices.connect('connect', () => {});
        setTimeout(() => {
          navigation.navigate('IndividualChat', {
            id: roomId?.room_id,
          });
          setChatLoader(false)
        }, 2000);
      } catch (e) {

      }finally{
        readNotification(item?._id)
      }
    }
  };
  const handleDelete = async(id) => {
    try {
      setChatLoader(true);
      const result = await apiCall?.deleteNotification({
        id: id,
      });
      getNotifications() ;
    } catch (error) {
      console.log("err",error)
    } finally {
      setChatLoader(false);
    }
  };
  const readNotification = async(id) => {
    console.log("id",id)
     try {
      const result = await apiCall?.readNotification({
        notification_id: id,
      });
      console.log("res",result)
    } catch (error) {
      console.log("err",error)
    } finally {
    }
  };
  const renderRightActions = (id) => {
    return (
      <View style={styles.deleteButton}>
        <TouchableOpacity
          onPress={() => handleDelete(id)}
          style={styles.deleteButtonText}
        >
        <Delete name={'delete'} size={width * 0.08} color={'#fff'} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1, padding: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <AppHeader navigation={navigation} title="Notifications" />
        <View style={{height: width * 0.1}} />
        <ScrollView
          contentContainerStyle={[
            styles?.contentContainer,
            {flex: (notifications?.length == 0 || chatLoader) && 1},
          ]}
          showsVerticalScrollIndicator={false}>
          {loading||chatLoader ? (
            <View
              style={styles.chatBox}>
              <ActivityIndicator size={'large'} color={'#747474'} />
            </View>
          ) : (!loading&&notifications?.length === 0) ? (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 20,
                fontSize: 16,
                color: '#999',
              }}>
              No Data Found
            </Text>
          ) : (
            notifications?.map((item, index) => (
              <Swipeable renderRightActions={() => renderRightActions(item?._id)}>
              <TouchableOpacity
                onPress={() => {
                  handlePress(item);
                }}
                key={index}
                style={styles.card}>
                <View
                  style={[
                    styles.cardHeader,
                    {flexDirection: 'row', marginTop: 16},
                  ]}>
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
                      <Ionicons
                        name="notifications-outline"
                        size={30}
                        color={'white'}
                      />
                      {/* <Image
                        resizeMode="contain"
                        // source={AppImages?.logo}
                        style={{height: 40, width: 40}}
                      /> */}
                    </View>
                  </View>

                  <View style={{width: '85%'}}>
                    <Text numberOfLines={1} style={styles.cardTitle}>
                      {item?.title}
                    </Text>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                      }}>
                      {/* <Text style={styles.cardCategory}>{item?.type}</Text> */}
                    </View>
                    <View style={{flexDirection: 'row',alignItems:"center"}}>
                      <>
                        <Text
                          style={[styles.cardDescription,{ fontFamily: item?.is_seen?'Poppins-Regular':'Poppins-Bold'}]}
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          {item?.content}
                        </Text>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 0.2,
                          }}>
                          {item?.unread_count > 0 && (
                            <View style={styles.countView}>
                              <Text
                                style={styles.count}
                                numberOfLines={2}
                                ellipsizeMode="tail">
                                {item?.unread_count}
                              </Text>
                            </View>
                          )}
                          <Text
                            style={[styles.chatDate,{ fontFamily: item?.is_seen?'Poppins-Regular':'Poppins-Bold'}]}
                            numberOfLines={2}
                            ellipsizeMode="tail">
                            {moment(item?.updated_at).format('LT')}
                          </Text>
                        </View>
                      </>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              </Swipeable>
            ))
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default Notifications;
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
    borderBottomWidth: 1,
    borderColor: '#c2c2c2',
    padding:width*0.02
  },
  cardHeader: {
    marginBottom: 5,
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1C5A9A',
    // marginBottom: 4,
  },
  cardCategory: {
    fontSize: 12,
    color: '#EAA141',
    fontFamily: 'Poppins-Regular',
  },
  cardDescription: {
    fontSize: width * 0.03,
    color: '#777',
    fontFamily: 'Poppins-Regular',
    // marginVertical: 8,
    flex: 0.8,
  },
  chatDate: {
    fontSize: width * 0.03,
    color: '#777',
    fontFamily: 'Poppins-Regular',
    marginVertical: 8,
  },
  count: {
    fontSize: 10,
    color: '#fff',
    // fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  countView: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: width * 0.06,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
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
    bottom: 1,
  },
  dot: {width: 8, height: 8, backgroundColor: 'green', borderRadius: 8},
  cardResponses: {
    fontSize: 12,
    color: '#5491C9',
  },
  submitButton: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    padding: width * 0.03,
    // width: '50%',
    height: 50,
    backgroundColor: '#0F5189',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    // marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: width * 0.08,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    // fontWeight: '600',
  },
  dateView: {
    width: width * 0.3,
    height: width * 0.08,
    backgroundColor: '#EAA141',
    position: 'absolute',
    right: 0,
    borderTopEndRadius: 20,
    borderBottomStartRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  innerTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: width * 0.08,
    borderTopStartRadius: width * 0.12,
    borderTopEndRadius: width * 0.12,
    backgroundColor: '#fff',
  },
  chatBox:{
    width: '90%',
    height: '30%',
    // backgroundColor: 'rgba(0,0,0,0.05)',
    alignSelf: 'center',
    top: width * 0.4,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  deleteButtonText: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
