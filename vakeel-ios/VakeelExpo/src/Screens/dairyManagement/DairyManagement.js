import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
  BackHandler,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {getDataLocally, showToast} from '../../helpers';
import {apiCall} from '../../services/apiCall';
import {AppImages} from '../../Utils/ImagesUrl';
import AppHeader from '../../Components/AppHeader';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import moment from 'moment';

const {width} = Dimensions.get('window');

const DairyManagement = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const [cases1, setCases1] = useState([]);
  const [allCases, setAllCases] = useState([]);
  const [allCases1, setAllCases1] = useState([]);
  const [selected, setSelected] = useState(new Date());
  const [markedDates, setMarkedDates] = useState({});
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    getAllCalendarDates();
    getSelectedDateCases();
    getAllCases();
  }, [selected]);
  useEffect(() => {
    getAllCases();
  }, []);
  const handleDayPress = async day => {
    const newDate = day.dateString;
    let obj = {
      month: moment(selected).format('MMMM YYYY'),
    };
    try {
      let result = await apiCall?.getCalendarDates(obj);
      const updatedMarked = result?.data?.hearingDays?.reduce((acc, date) => {
        acc[date] = {
          marked: true,
          dotColor: '#EAA141',
        };
        return acc;
      }, {});

      updatedMarked[newDate] = {
        ...updatedMarked[newDate],
        selected: true,
        selectedColor: '#EAA141',
      };

      setMarkedDates(updatedMarked);
      setSelected(newDate);
    } catch {}
  };

  const getAllCalendarDates = async () => {
    let obj = {
      month: moment(selected).format('MMMM YYYY'),
    };
    try {
      let result = await apiCall?.getCalendarDates(obj);
      const marked = result?.data?.hearingDays?.reduce((acc, date) => {
        acc[date] = {
          marked: true,
          dotColor: '#EAA141', // Customize dot color
        };
        return acc;
      }, {});

      if (selected) {
        marked[selected] = {
          ...marked[selected], // Retain dot if present
          selected: true,
          selectedColor: 'orange',
        };
      }

      setMarkedDates(marked);
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
      console.log('error', error);
    } finally {
    }
  };
  const getSelectedDateCases = async () => {
    let obj = {
      date: moment(selected).format('YYYY-MM-DD'),
    };
    try {
      let result = await apiCall?.getSelectedDateCases(obj);
      const grouped = result?.data?.selectedDateCases?.reduce((acc, item) => {
        const date = moment(item.next_hearing).format('YYYY-MM-DD'); 
        let group = acc.find(g => g.date === date);
        if (group) {
          group.data.push(item);
        } else {
          acc.push({ date, data: [item] });
        }
        return acc;
      }, []);
      console.log("gr",grouped)
      setCases1(grouped)
      setCases(result?.data?.selectedDateCases);
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
      console.log('error', error);
    } finally {
    }
  };
  const getAllCases = async () => {
    let obj = {
      date: moment(selected).format('YYYY-MM-DD'),
    };
    try {
      let result = await apiCall?.getSelectedDateCases(obj);
      const grouped = result?.data?.nextCases?.reduce((acc, item) => {
        const date = moment(item.next_hearing).format('YYYY-MM-DD'); 
        let group = acc.find(g => g.date === date);
        if (group) {
          group.data.push(item);
        } else {
          acc.push({ date, data: [item] });
        }
        return acc;
      }, []);
      setAllCases1(grouped)
      setAllCases(result?.data?.nextCases);
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
      console.log('error', error);
    } finally {
    }
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
        <AppHeader navigation={navigation} title="Diary Management" />

        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{paddingVertical: 10}}>
            <Calendar
              theme={{
                textMonthFontSize: 16, // optional: adjust the font size
                textSectionTitleColor: '#1C5A9A', // optional: color for section titles
                arrowColor: 'orange', // optional: color for navigation arrows
                monthTextColor: '#1C5A9A', // Set header text color (month/year)
              }}
              style={{
                backgroundColor: 'transparent',
                height: width * 0.92,
              }}
              onDayPress={handleDayPress}
              markedDates={markedDates}
            />
            {cases.length === 0 ? (
              //   <Text
              //     style={{
              //       textAlign: 'center',
              //       marginTop: 20,
              //       fontSize: 16,
              //       color: '#999',
              //     }}>
              //     No Data Found
              //   </Text>
              <View />
            ) : (
              // cases?.map((item, index) => (
              //   <>
              //     <View style={{flexDirection: 'row', alignItems: 'center'}}>
              //       <Text style={[styles.calendatDateHeading, {flex: 0.3}]}>
              //         {moment(item?.next_hearing).format('DD')}
              //       </Text>
              //       <Text
              //         style={[styles.calendatDateHeading, {left: 20, flex: 2}]}>
              //         {moment(item?.next_hearing).format('dddd')}
              //       </Text>
              //     </View>

              //     <View
              //       style={{flexDirection: 'row', marginTop: -width * 0.02}}>
              //       <Text style={[styles.calendatDateSubHeading, {flex: 0.3}]}>
              //         {moment(item?.next_hearing).format('MMM')}
              //       </Text>
              //       <Text
              //         style={[
              //           styles.calendatDateSubHeading,
              //           {left: 20, flex: 2},
              //         ]}>
              //         {`${cases?.length} ${
              //           cases?.length === 1 ? 'case' : 'cases'
              //         } hearing`}
              //       </Text>
              //     </View>
              //     <View style={{height: width * 0.04}} />
              //     <TouchableOpacity
              //       onPress={() => {
              //         navigation.navigate('CaseDetails', {details: item});
              //       }}
              //       key={index}
              //       style={[
              //         styles.card,
              //         {
              //           backgroundColor:
              //             moment(item?.created_at).format('YYYY-MM-DD') ==
              //             moment(new Date()).format('YYYY-MM-DD')
              //               ? '#0F5189'
              //               : '#5491C9',
              //         },
              //       ]}>
              //       <View style={{}}>
              //         <Text numberOfLines={1} style={styles.cardTitle}>
              //           {item?.title}
              //         </Text>
              //         <View
              //           style={{
              //             width: '100%',
              //             flexDirection: 'row',
              //             justifyContent: 'flex-start',
              //           }}>
              //           <Text style={styles.cardCategory}>
              //             {item?.category?.name + '/' + item?.subcategory?.name}
              //           </Text>
              //         </View>
              //       </View>

              //       <View style={styles.cardFooter}>
              //         <View
              //           style={{
              //             flexDirection: 'row',
              //             alignItems: 'center',
              //             justifyContent: 'center',
              //           }}>
              //           <View style={styles?.dot} />
              //           <Text style={styles.cardDate}>{item?.party_1?.charAt(0)?.toUpperCase() + item?.party_1?.slice(1)}</Text>
              //         </View>
              //         <Text style={styles.cardResponses}>
              //           {item?.client_name?.charAt(0)?.toUpperCase() + item?.client_name?.slice(1)}
              //         </Text>
              //       </View>
              //       <Text style={styles.cardResponses}>
              //         {item?.police_station?.charAt(0)?.toUpperCase() + item?.police_station?.slice(1)}
              //         {/* {'Additional District & Session Judge, Lahore'} */}
              //       </Text>
              //     </TouchableOpacity>
              //   </>
              // ))
              cases1?.map((item1, index) => (
                <>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.calendatDateHeading, {flex: 0.3}]}>
                      {moment(item1?.date).format('DD')}
                    </Text>
                    <Text
                      style={[styles.calendatDateHeading, {left: 20, flex: 2}]}>
                      {moment(item1?.date).format('dddd')}
                    </Text>
                  </View>

                  <View
                    style={{flexDirection: 'row', marginTop: -width * 0.01}}>
                    <Text style={[styles.calendatDateSubHeading, {flex: 0.3}]}>
                      {moment(item1?.date).format('MMM')}
                    </Text>
                    <Text
                      style={[
                        styles.calendatDateSubHeading,
                        {left: 20, flex: 2, fontFamily: 'Poppins-Regular'},
                      ]}>
                      {`${item1?.data?.length} ${
                        item1?.data?.length === 1 ? 'case' : 'cases'
                      } hearing`}
                    </Text>
                  </View>
                  <View style={{height: width * 0.08}} />
                 { item1?.data?.map((item)=>(
                      <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('CaseDetails', {details: item});
                    }}
                    key={index}
                    style={[
                      styles.card,
                      {
                        backgroundColor:
                        index === 0
                            ? '#0F5189'
                            : '#5491C9',
                      },
                    ]}>
                    <View style={{}}>
                      <Text numberOfLines={1} style={styles.cardTitle}>
                        {item?.title}
                      </Text>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                        }}>
                        <Text style={styles.cardCategory}>
                          {item?.category?.name + '/' + item?.subcategory?.name}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={styles?.dot} />
                        <Text style={styles.cardDate}>{item?.party_1?.charAt(0)?.toUpperCase() + item?.party_1?.slice(1)}</Text>
                      </View>
                      <Text style={styles.cardResponses}>
                        {item?.client_name?.charAt(0)?.toUpperCase() + item?.client_name?.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.cardResponses}>
                      {item?.police_station?.charAt(0)?.toUpperCase() + item?.police_station?.slice(1)}
                      {/* {'Additional District & Session Judge, Lahore'} */}
                    </Text>
                  </TouchableOpacity>
                 ))}
                </>
              ))
            )}
            {allCases.length === 0 ? (
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
              // allCases?.map((item, index) => (
              //   <>
              //     <View style={{flexDirection: 'row', alignItems: 'center'}}>
              //       <Text style={[styles.calendatDateHeading, {flex: 0.3}]}>
              //         {moment(item?.next_hearing).format('DD')}
              //       </Text>
              //       <Text
              //         style={[styles.calendatDateHeading, {left: 20, flex: 2}]}>
              //         {moment(item?.next_hearing).format('dddd')}
              //       </Text>
              //     </View>

              //     <View
              //       style={{flexDirection: 'row', marginTop: -width * 0.01}}>
              //       <Text style={[styles.calendatDateSubHeading, {flex: 0.3}]}>
              //         {moment(item?.next_hearing).format('MMM')}
              //       </Text>
              //       <Text
              //         style={[
              //           styles.calendatDateSubHeading,
              //           {left: 20, flex: 2, fontFamily: 'Poppins-Regular'},
              //         ]}>
              //         {`${allCases?.length} ${
              //           allCases?.length === 1 ? 'case' : 'cases'
              //         } hearing`}
              //       </Text>
              //     </View>
              //     <View style={{height: width * 0.08}} />
              //     <TouchableOpacity
              //       onPress={() => {
              //         navigation.navigate('CaseDetails', {details: item});
              //       }}
              //       key={index}
              //       style={[
              //         styles.card,
              //         {
              //           backgroundColor:
              //             moment(item?.created_at).format('YYYY-MM-DD') ===
              //             moment(new Date()).format('YYYY-MM-DD')
              //               ? '#E7E7E7'
              //               : '#E7E7E7',
              //         },
              //       ]}>
              //       <View style={{}}>
              //         <Text numberOfLines={1} style={styles.allCasesCardTitle}>
              //           {item?.title}
              //         </Text>
              //         <View
              //           style={{
              //             width: '100%',
              //             flexDirection: 'row',
              //             justifyContent: 'flex-start',
              //           }}>
              //           <Text style={styles.allCaseCardCategory}>
              //             {item?.category?.name + '/' + item?.subcategory?.name}
              //           </Text>
              //         </View>
              //       </View>

              //       <View style={styles.cardFooter}>
              //         <View
              //           style={{
              //             flexDirection: 'row',
              //             alignItems: 'center',
              //             justifyContent: 'center',
              //           }}>
              //           {/* <View style={styles?.dot} /> */}
              //           <Text style={styles.allCaseCardResponses}>
              //             {item?.party_1?.charAt(0)?.toUpperCase() + item?.party_1?.slice(1)}
              //           </Text>
              //         </View>
              //         <Text style={styles.allCaseCardResponses}>
              //           {item?.client_name.charAt(0)?.toUpperCase() + item?.client_name?.slice(1)}
              //         </Text>
              //       </View>
              //       <Text
              //         style={[
              //           styles.allCaseCardResponses,
              //           {fontFamily: 'Poppins-Regular'},
              //         ]}>
              //         {item?.police_station}
              //         {/* {'Additional District & Session Judge, Lahore'} */}
              //       </Text>
              //     </TouchableOpacity>
              //   </>
              // ))
              allCases1?.map((item1, index) => (
                <>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.calendatDateHeading, {flex: 0.3}]}>
                      {moment(item1?.date).format('DD')}
                    </Text>
                    <Text
                      style={[styles.calendatDateHeading, {left: 20, flex: 2}]}>
                      {moment(item1?.date).format('dddd')}
                    </Text>
                  </View>

                  <View
                    style={{flexDirection: 'row', marginTop: -width * 0.01}}>
                    <Text style={[styles.calendatDateSubHeading, {flex: 0.3}]}>
                      {moment(item1?.date).format('MMM')}
                    </Text>
                    <Text
                      style={[
                        styles.calendatDateSubHeading,
                        {left: 20, flex: 2, fontFamily: 'Poppins-Regular'},
                      ]}>
                      {`${item1?.data?.length} ${
                        item1?.data?.length === 1 ? 'case' : 'cases'
                      } hearing`}
                    </Text>
                  </View>
                  <View style={{height: width * 0.08}} />
                 { item1?.data?.map((item)=>(
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('CaseDetails', {details: item});
                    }}
                    key={index}
                    style={[
                      styles.card,
                      {
                        backgroundColor:
                        index === 0
                            ? '#E7E7E7'
                            : '#E7E7E7',
                      },
                    ]}>
                    <View style={{}}>
                      <Text numberOfLines={1} style={styles.allCasesCardTitle}>
                        {item?.title}
                      </Text>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                        }}>
                        <Text style={styles.allCaseCardCategory}>
                          {item?.category?.name + '/' + item?.subcategory?.name}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {/* <View style={styles?.dot} /> */}
                        <Text style={styles.allCaseCardResponses}>
                          {item?.party_1?.charAt(0)?.toUpperCase() + item?.party_1?.slice(1)}
                        </Text>
                      </View>
                      <Text style={styles.allCaseCardResponses}>
                        {item?.client_name.charAt(0)?.toUpperCase() + item?.client_name?.slice(1)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.allCaseCardResponses,
                        {fontFamily: 'Poppins-Regular'},
                      ]}>
                      {item?.police_station}
                      {/* {'Additional District & Session Judge, Lahore'} */}
                    </Text>
                  </TouchableOpacity>
                 ))}
                </>
              ))          
            )}
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default DairyManagement;
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
    backgroundColor: '#5491C9',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#c2c2c2',
  },
  cardHeader: {
    marginBottom: 5,
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: -width * 0.01,
  },
  cardCategory: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#1C5A9A',
    borderTopWidth: 0.3,
    paddingTop: 5,
    marginTop: width * 0.04,
  },
  cardDate: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 3,
    bottom: 1,
  },
  dot: {width: 8, height: 8, backgroundColor: 'green', borderRadius: 8},
  cardResponses: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  allCaseCardResponses: {
    fontSize: 12,
    color: '#4D4D4D',
    fontFamily: 'Poppins-SemiBold',
  },
  calendatDateHeading: {
    fontSize: width * 0.075,
    fontFamily: 'Marathon-Serial Bold',
    color: '#0F5189',
  },
  calendatDateSubHeading: {
    fontSize: width * 0.045,
    fontFamily: 'Poppins-Medium',
    color: '#8A8A8A',
  },
  allCasesCardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#4D4D4D',
    marginBottom: -10,
  },
  allCaseCardCategory: {
    fontSize: 12,
    color: '#4D4D4D',
    fontFamily: 'Poppins-SemiBold',
  },
});
