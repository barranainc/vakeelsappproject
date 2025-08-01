// App.js
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppImages} from '../../Utils/ImagesUrl';
import AppHeader from '../../Components/AppHeader';
import SocketServices from '../../services/sockets/SocketServices';
import {enviroment} from '../../environment';
import {io} from 'socket.io-client';
import Send from 'react-native-vector-icons/Ionicons';
import {apiCall} from '../../services/apiCall';
import {getDataLocally} from '../../helpers';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
const {width} = Dimensions.get('window');

const IndividualChat = ({route}) => {
  const socket = io(enviroment?.API_URL); // Replace with your server URL
  const {id} = route?.params || '';
  const {details,type,defaultMessage} = route?.params || '';
  const flatListRef = useRef(null);
  const [message, setMessage] = useState('');
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [getLocalData, setGetLocalData] = useState(false);
  const [isMatterOpen, setIsMatterOpen] = useState(false);
  const getAllChats = async (isLoad) => {
   if(!isLoad){setChats([]);}
    let obj = {
      room_id: id,
      limit: 50,
    };
    try {
      if(!isLoad){
      setLoading(true);
      }
      let result = await apiCall?.getRoomChat(obj);
      setMessages(result?.data?.users?.reverse());
    } catch (error) {
      console.log('error', error ? error : 'Something went wrong');
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  const getRoomDetails = async () => {
    const getDataLocalData = await getDataLocally();
    setGetLocalData(getDataLocalData);
    let obj = {
      room_id: id,
    };
    try {
      setLoading(true);
      let result = await apiCall?.getRoomDetails(obj);
      setRoomDetails(result?.data?.details);
      if(defaultMessage){
        console.log("res")
        SocketServices.sendMessage('sendMessage', {
          room_id: id,
          sender_id:
            getDataLocalData?.user_type === 'client'
              ? result?.data?.details?.client?._id
              : result?.data?.details?.requester?._id,
          receiver_id:
            getDataLocalData?.user_type === 'client'
              ? result?.data?.details?.requester?._id
              : result?.data?.details?.client?._id,
          message: "Hello! 👋 Thank you for submitting your case. I've reviewed the details you've provided, and I'm here to help. Please feel free to share any additional information or documents that might be useful. Looking forward to assisting you further.",
          type: Array.isArray(result?.data?.details?.matterDetails) ? 'Request' : 'Matter',
          type_name: Array.isArray(result?.data?.details?.matterDetails)
            ? result?.data?.details?.requestDetails?.title
            : result?.data?.details?.matterDetails?.title,
        });
        setMessage(''); // Clear the input field
      }
    } catch (error) {
      console.log('error', error ? error : 'Something went wrong');
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    socket.emit('joinRoom', id);
    socket.on('receiveMessage', data => {
      console.log("data",JSON.parse(data))
      setMessages(prevMessages => [...prevMessages, JSON.parse(data)]);
      getAllChats(true)
    });

    // Cleanup on component unmount
    return () => socket.off('message');
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      SocketServices.sendMessage('sendMessage', {
        room_id: id,
        sender_id:
          getLocalData?.user_type === 'client'
            ? roomDetails?.client?._id
            : roomDetails?.requester?._id,
        receiver_id:
          getLocalData?.user_type === 'client'
            ? roomDetails?.requester?._id
            : roomDetails?.client?._id,
        message: message,
        type: Array.isArray(roomDetails?.matterDetails) ? 'Request' : 'Matter',
        type_name: Array.isArray(roomDetails?.matterDetails)
          ? roomDetails?.requestDetails?.title
          : roomDetails?.matterDetails?.title,
      });
      setMessage(''); // Clear the input field
    }
  };
  useEffect(() => {
    getRoomDetails();
    getAllChats();
  }, []);
  // console.log("roomDetails",roomDetails)
  useFocusEffect(
    useCallback(() => {
      // This runs when the screen is focused
      console.log('Screen has gained focus!');

      // Return a cleanup function that will run when screen loses focus
      return () => {
        socket.emit('leaveRoom', id);
        // Call your function here when screen exits
      };
    }, []),
  );
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      try {
        flatListRef.current.scrollToIndex({
          index: messages.length - 1,
          animated: true,
        });
      } catch (error) {
        console.warn('Error scrolling to last message:', error);
      }
    }
  }, [messages, roomDetails]);
  const matterView = () => {
    setIsMatterOpen(!isMatterOpen);
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
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
    <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1, padding: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <TouchableOpacity onPress={()=>{navigation?.navigate("LawyerDetails",{id:roomDetails?.client?.lawyer_details?.role_id})}}>
        <AppHeader
          navigation={navigation}
          title={
            roomDetails &&
            (getLocalData?.user_type === 'client'
              ? roomDetails?.requester?.first_name +
                ' ' +
                roomDetails?.requester?.last_name
              : roomDetails?.client?.first_name +
                ' ' +
                roomDetails?.client?.last_name)
          }
          chat={type==='client_request'?"Request":'Matter'}
          onPress={matterView}
        />
        </TouchableOpacity>
        <View style={{height: width * 0.12}} />
        {roomDetails && (
          <View style={styles.contentContainer}>
            <FlatList
              data={messages}
              ref={flatListRef}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={
                isMatterOpen && (
                  <View style={styles.card}>
                    <View style={[styles.cardHeader, {flexDirection: 'row'}]}>
                      <View
                        style={{
                          width: '25%',
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
                            source={AppImages?.Post_Matter}
                            style={{height: 40, width: 40}}
                          />
                        </View>
                      </View>

                      <View style={{width: '75%'}}>
                        <Text style={styles.cardTitle}>
                          {Array.isArray(roomDetails?.matterDetails)
                            ? roomDetails?.requestDetails?.title
                            : roomDetails?.matterDetails?.title}
                        </Text>
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                          }}>
                            
                          <Text style={styles.cardCategory}>
                            {Array.isArray(roomDetails?.matterDetails)
                              ? `${roomDetails?.requestDetails?.service?.name?roomDetails?.requestDetails?.service?.name:''}  ${roomDetails?.requestDetails?.sub_service?.name?'/'+roomDetails?.requestDetails?.sub_service?.name:''}`:
                                `${roomDetails?.matterDetails?.category?.name?roomDetails?.matterDetails?.category?.name:''}  ${roomDetails?.matterDetails?.subcategory?.name?'/'+roomDetails?.matterDetails?.subcategory?.name:''}`
                              }
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text
                      style={styles.cardDescription}
                      // numberOfLines={2}
                      ellipsizeMode="tail">
                      {Array.isArray(roomDetails?.matterDetails)
                        ? roomDetails?.requestDetails?.description
                        : roomDetails?.matterDetails?.description}
                    </Text>
                    <View style={styles.cardFooter}>
                      <View style={{flexDirection: 'row'}}>
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#A9A9A9"
                        />
                        <Text style={styles.cardDate}>
                          {Array.isArray(roomDetails?.matterDetails)
                            ? moment(
                                roomDetails?.created_at?.created_at,
                              ).format('DD-MM-YYYY')
                            : moment(
                                roomDetails?.matterDetails?.created_at,
                              ).format('DD-MM-YYYY')}
                        </Text>
                      </View>
                      {/* <Text style={styles.cardResponses}>
                                    {'40 Lawyers Responded'}
                                  </Text> */}
                    </View>
                  </View>
                )
              }
              renderItem={({item}) => (
                <>
                  <View
                    style={[
                      styles?.messageView,
                      // {
                      //   borderStartStartRadius:
                      //     roomDetails?.client?._id !== item?.sender_id &&
                      //     width * 0.08,
                      //   borderEndStartRadius:
                      //     roomDetails?.client?._id === item?.sender_id &&
                      //     width * 0.08,
                      //   borderEndEndRadius: width * 0.08,
                      //   borderStartEndRadius: width * 0.08,
                      //   backgroundColor:
                      //     roomDetails?.client?._id === item?.sender_id
                      //       ? '#EBEBEB'
                      //       : '#E0D5FF',
                      //   alignSelf:
                      //     roomDetails?.client?._id !== item?.sender_id
                      //       ? 'flex-end'
                      //       : 'flex-start',
                      // },
                      {
                        borderStartStartRadius:
                          roomDetails?.client?._id !== item?.sender_id &&
                          width * 0.08,
                        borderEndStartRadius:
                          roomDetails?.client?._id === item?.sender_id &&
                          width * 0.08,
                        borderEndEndRadius: width * 0.08,
                        borderStartEndRadius: width * 0.08,
                        backgroundColor:
                          roomDetails?.client?._id === item?.sender_id
                            ? '#EBEBEB'
                            : '#E0D5FF',
                        alignSelf:
                          roomDetails?.client?._id !== item?.sender_id
                            ? 'flex-end'
                            : 'flex-start',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.message,
                        {
                          alignSelf:
                            roomDetails?.client?._id !== item?.sender_id
                              ? 'right'
                              : 'left',
                        },
                      ]}>
                      {item?.message}
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: width * 0.04,
                      alignSelf:
                        roomDetails?.client?._id !== item?.sender_id
                          ? 'flex-end'
                          : 'flex-start',
                    }}>
                    <Text
                      style={[
                        styles.message,
                        {
                          fontSize: width * 0.025,
                        },
                      ]}>
                      {moment(item?.sent_at).format('LT')}
                    </Text>
                  </View>
                </>
              )}
              getItemLayout={(data, index) => ({
                length: width * 0.12, // Provide fixed height of each item
                offset: width * 0.25 * index, // This calculates the position of each item based on its index
                index,
              })}
            />
            <View
              style={[
                styles?.inputContainer,
                {height: 55, borderColor: '#c2c2c2', alignItems: 'center'},
              ]}>
              <TextInput
                placeholderTextColor={'#747474'}
                placeholder="Type a message..."
                value={message}
                onChangeText={setMessage}
                style={styles?.input}
              />
              <Send
                style={{color: '#0CB6BC'}}
                name={'send-sharp'}
                size={width * 0.06}
                onPress={sendMessage}
              />
            </View>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E5E5',
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
  container1: {flex: 1, padding: 16, backgroundColor: '#fff'},
  message: {
    color: '#000000',
    fontSize: width * 0.035,
  },
  messageView: {
    backgroundColor: '#E0D5FF',
    margin: width * 0.02,
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.04,
    maxWidth: '70%',
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: width * 0.08,
    borderTopStartRadius: width * 0.12,
    borderTopEndRadius: width * 0.12,
    backgroundColor: '#fff',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
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
  input: {
    width: '95%',
    fontSize: 14,
    backgroundColor: '#FFF',
    fontFamily: 'Poppins-Regular',
    color: '#000',
    // textAlignVertical:"top"
  },
});

export default IndividualChat;
