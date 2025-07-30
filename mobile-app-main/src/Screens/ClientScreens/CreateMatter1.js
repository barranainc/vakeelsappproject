import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import AppHeader from '../../Components/AppHeader';
import {AppImages} from '../../Utils/ImagesUrl';
import {endpoints, urls} from '../../services/Endpionts';
import {enviroment} from '../../environment';
import { SafeAreaView } from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

export default function CreateMatter1({navigation}) {
  const [selectedBox, setSelectedBox] = useState(null);
  const [boxData, setBoxData] = useState([]);
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${urls.LiveBaseUrl}${endpoints.create_matter}?only_parent=${true}`,
        );
        const json = await response.json();
        if (json.status && json.responseCode === 200) {
          const categories = json.data.categories.map(item => ({
            id: item._id,
            label: item.name,
            icon: item?.icon,
            // subcategories: item.subcategories, // Include subcategories
          }));
          setBoxData(categories);
        } else {
          console.error('Error fetching categories:', json.message);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1, padding: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <AppHeader
          navigation={navigation}
          title="Create Matter"
          progress="1/3"
        />

        <View style={styles.container}>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={styles.title}>Select Type</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#FFA500" />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.grid}>
                {boxData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.box,
                      selectedBox === index && styles.selectedBox,
                    ]}
                    onPress={() => {
                      setSelectedBox(index);
                      // navigation.navigate('CreateMatter2', {
                      //     subcategories: item.subcategories,
                      // });
                    }}>
                    <Image
                      source={
                        item?.icon
                          ? {uri: `${enviroment.API_URL}${item.icon}`}
                          : AppImages?.Default_Icon
                      }
                      style={styles.icon}
                    />
                    <Text
                      style={[
                        styles.boxText,
                        selectedBox === index && styles.selectedBoxText,
                      ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              selectedBox === null && {backgroundColor: '#D3D3D3'}, // Gray out when inactive
            ]}
            onPress={() => {
              const selectedCategory = boxData[selectedBox];
              if (selectedCategory) {
                navigation.navigate('CreateMatter2', {
                  subcategories: selectedCategory?.id,
                });
              }
            }}
            disabled={selectedBox === null} // Disable when no option is selected
          >
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Align boxes to start without extra spacing
    // Optionally, add spacing between rows
    gap: 10, // Adjust this value for desired spacing
  },
  box: {
    width: width * 0.27,
    height: width * 0.3,
    borderWidth: 1,
    borderColor: '#D1D3D4',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedBox: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  boxText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  selectedBoxText: {
    color: '#FFF',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFA500',
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
});
