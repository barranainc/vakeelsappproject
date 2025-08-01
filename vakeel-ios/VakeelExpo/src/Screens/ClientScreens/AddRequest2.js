import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import AppHeader from '../../Components/AppHeader';
import {AppImages} from '../../Utils/ImagesUrl';
import {showToast} from '../../helpers';
import {apiCall} from '../../services/apiCall';
import Entypo from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';

const {height} = Dimensions.get('window');

export default function AddRequest2({navigation, route}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOption1, setSelectedOption1] = useState(null);
  const [clildData, setClildData] = useState([]);
  const [services, setServices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const {type} = route?.params || '';
  console.log('type', type);
  const slideAnim = useRef(new Animated.Value(height)).current; // Start with the modal off-screen

  // Handle modal close
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedOption1(null);
    setSelectedOption(null);
    // getService(true, null);
  };
  const getService = async (isPrent, parentId,isChild) => {
    let obj = {
      only_parent: isPrent ? true : false,
      parent_id: parentId,
      type:!isChild?type:null
    };
    console.log("obj",obj)
    try {
      setLoader(isPrent ? true : false);
      setBtnLoader(true);
      let result = await apiCall?.getServices(obj);
      if (isPrent && !parentId) {
        setServices(result?.data?.categories);
      } else {
        if (result?.data?.categories?.length > 0) {
          setIsModalVisible(true);
          setClildData(result?.data?.categories);
        }
      }
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      setLoader(false);
      setBtnLoader(false);
    }
  };
  useEffect(() => {
    getService(true,null,false);
  }, []);
  return (
    <>
      {loader ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.2)',
          }}>
          <ActivityIndicator size={'large'} color={'#FFA500'} />
        </View>
      ) : (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <ImageBackground
            source={AppImages?.Login_Bg}
            style={{flex: 1, padding: 1}}
            imageStyle={{resizeMode: 'cover'}}>
            <AppHeader
              navigation={navigation}
              title="Paralegal Assistance"
              progress="2/3"
            />

            <View style={styles.container}>
              <Text style={styles.title}>Select Services</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.optionsContainer}>
                  {services.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.option,
                        selectedOption?._id === option?._id &&
                          styles.selectedOption,
                      ]}
                      onPress={() => {
                        setSelectedOption(option);
                        getService(false, option?._id,true);
                      }}>
                      <View
                        style={[
                          styles.radioCircle,
                          selectedOption?._id === option?._id &&
                            styles.selectedCircle,
                        ]}
                      />
                      <Text
                        style={[
                          styles.optionLabel,
                          selectedOption?._id === index && styles.selectedLabel,
                        ]}>
                        {option.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.submitButton}
                disabled={btnLoader ? true : false}
                onPress={() =>
                  navigation.navigate('AddRequest3', {
                    MatterDetails: {
                      type,
                      service_id: selectedOption?._id,
                      serviceName: selectedOption?.name,
                    },
                  })
                }>
                <Text style={styles.submitButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
          {/* Modal for bottom slider */}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide" // Disable default modal animation
            onRequestClose={closeModal}>
            <View onPress={closeModal} style={styles.modalOverlay}>
              <View style={[styles.modalContent]}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}>
                  <Entypo name="circle-with-cross" size={24} color="#555" />
                </TouchableOpacity>
                <View
                  style={{
                    width: '100%',
                    alignItems: 'flex-start',
                    paddingHorizontal: 10,
                    paddingBottom: 10,
                  }}>
                  <Text style={styles.modalTitle}>
                    Select {selectedOption?.name}
                  </Text>
                </View>
                <ScrollView style={styles.modalOptionsContainer}>
                  {clildData?.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.option,
                        selectedOption1 === option?._id &&
                          styles.selectedOption,
                      ]}
                      onPress={() => {
                        setSelectedOption1(option?._id);
                      }}>
                      <View
                        style={[
                          styles.radioCircle,
                          selectedOption1 === option?._id &&
                            styles.selectedCircle,
                        ]}
                      />
                      <Text
                        style={[
                          styles.optionLabel,
                          selectedOption1 === option?._id &&
                            styles.selectedLabel,
                        ]}>
                        {option?.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[styles.submitButton]}
                    onPress={() =>{
                      navigation.navigate('AddRequest3', {
                        MatterDetails: {
                          type,
                          service_id: selectedOption?._id,
                          sub_service_id: selectedOption1,
                          serviceName: selectedOption?.name,
                        },
                      })
                      setIsModalVisible(false);
                    }}>
                    <Text style={styles.submitButtonText}>Next</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      )}
    </>
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
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Backdrop color
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%', // Adjust height of the modal
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: '#323436',
    fontFamily: 'Marathon-Serial Bold',
    // fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  modalOptionsContainer: {
    marginBottom: 5,
    width: '100%',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D1D3D4',
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  modalOptionLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  closeButton: {
    width: '10%',
    height: 30,
    marginBottom: 20,
    padding: 3,
    backgroundColor: 'transparent',
    alignItems: 'center',
    borderRadius: 12,
    zIndex: 999,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
