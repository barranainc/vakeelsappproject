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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppImages} from '../../../Utils/ImagesUrl';
import AppHeader from '../../../Components/AppHeader';
import {enviroment} from '../../../environment';

const {width} = Dimensions.get('window');

export default function TeamMemberDetails({navigation, route}) {
  const {details} = route.params || '';
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
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1, padding: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <AppHeader chat={'Edit'} onPress={()=>navigation?.navigate("EditTeam1",{details:details})} navigation={navigation} title="Team Profile" />

        <ScrollView
          contentContainerStyle={[
            styles.container1,
            {paddingBottom: 20, flexGrow: 1},
          ]}>
          <View
            style={{
              alignItems: 'center',
              paddingVertical: 30,
            }}>
            <View
              style={{
                marginBottom: 10,
                width: 100,
                height: 100,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                backgroundColor: '#c2c2c2',
                padding: 10,
              }}>
              <Image
                style={{width: 100, height: 100, borderRadius: 100}}
                source={{
                  uri: enviroment?.API_URL + details?.picture,
                }}
              />
            </View>
            <Text
              style={
                styles.textStyle1
              }>{`${details?.first_name} ${details?.last_name}`}</Text>
            <Text style={styles.textStyle2}>{details?.user_type}</Text>
            <View style={styles.contentContainer}>
              <View>
                <Text style={styles.placeHolder}>Email</Text>
                <Text style={styles.title}>{details?.email}</Text>
              </View>
              <View>
                <Text style={styles.placeHolder}>phone</Text>
                <Text style={styles.title}>{details?.phone}</Text>
              </View>
              <View>
                <Text style={styles.placeHolder}>CNIC</Text>
                <Text style={styles.title}>{details?.cnic_number}</Text>
              </View>
              <View>
                <Text style={styles.placeHolder}>Bar Council ID</Text>
                <Text style={styles.title}>{details?.council_id}</Text>
              </View>
              <View style={styles.line} />

              <Text style={styles.sectionTitle}>CNIC</Text>
              <>
                <View style={styles.uploadContainer1}>
                  <View style={styles.uploadBox2}>
                    <Image
                      style={[styles.cnicImage1]}
                      source={{
                        uri: enviroment?.API_URL + details.cnic_front,
                      }}
                    />
                  </View>
                  <View style={styles.uploadBox2}>
                    <Image
                      style={[styles.cnicImage1]}
                      source={{
                        uri: enviroment?.API_URL + details.cnic_front,
                      }}
                    />
                  </View>
                </View>
              </>

              <Text style={styles.sectionTitle}>Professional Documents</Text>
              <>
                <View style={styles.uploadContainer1}>
                  {details?.lawyer_details?.professional_documents?.map(
                    (item, index) => (
                      <TouchableOpacity key={index} style={styles.uploadBox1}>
                        <Image
                          style={[styles.cnicImage]}
                          source={{
                            uri: enviroment?.API_URL + item,
                          }}
                        />
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              </>

              <Text style={styles.sectionTitle}>Bar Council Documents</Text>
              <>
                <View style={styles.uploadContainer1}>
                  {details?.lawyer_details?.council_documents?.map(
                    (item, index) => (
                      <TouchableOpacity key={index} style={styles.uploadBox1}>
                        <Image
                          style={[styles.cnicImage]}
                          source={{
                            uri: enviroment?.API_URL + item,
                          }}
                        />
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              </>
            </View>
          </View>
        </ScrollView>
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
  textStyle: {
    color: '#404B53',
    fontFamily: 'Poppins-SemiBold',
  },
  textStyle1: {
    fontFamily: 'Poppins-Bold',
    color: '#404B53',
    fontSize: width * 0.045,
  },
  textStyle2: {
    fontFamily: 'Poppins-SemiBold',
    color: '#EAA141',
    marginTop: -5,
  },
  submitButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 15,
    // marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  uploadContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
    flexWrap:"wrap",
    gap:4
  },
  uploadBox1: {
    width: '32%',
    height: width * 0.32,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: width * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadBox2: {
    width: '48%',
    height: width * 0.3,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: width * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cnicImage: {
    width: width * 0.25,
    height: width * 0.3,
  },
  cnicImage1: {
    width: width * 0.55,
    height: width * 0.3,
  },
  contentContainer: {
    width: '95%',
    padding: 20,
    margin: 20,
    gap: 16,
  },
  placeHolder: {
    fontFamily: 'Poppins-Regular',
    color: '#A4A9AE',
    fontSize: width * 0.035,
  },
  title: {
    fontFamily: 'Poppins-Regular',
    color: '#404B53',
    fontSize: width * 0.035,
  },
  line: {
    width: '90%',
    height: 2,
    backgroundColor: '#A4A9AE',
  },
  sectionTitle: {
    fontSize: width * 0.07,
    fontFamily: 'Marathon-Serial Regular',
    marginBottom: 5,
    color: '#A4A9AE',
  },
});
