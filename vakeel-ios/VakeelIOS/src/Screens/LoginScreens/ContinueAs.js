import React from 'react';
import { StyleSheet, Text,Dimensions, TouchableOpacity, View, ImageBackground } from 'react-native';
import { AppImages } from '../../Utils/ImagesUrl'; // Ensure AppImages? is correctly imported or replaced

const { width, height } = Dimensions.get('window');
export default function ContinueAs({ navigation }) {
  return (
    <ImageBackground
      source={AppImages?.Continue_As} // Replace with your image path
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={{ width: '90%', paddingBottom: 10 }}>

          <Text style={styles.heading}>Continue as</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.clientButton]}
          onPress={() =>
            navigation.navigate('Login', { userType: 'client' })
          }>
          <Text style={styles.buttonText}>Client</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.assistantButton]}
          onPress={() =>
            navigation.navigate('Login', { userType: 'Paralegal' })
          }>
          <Text style={styles.buttonText}>Paralegal Assistant</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.lawyerButton]}
          onPress={() =>
            navigation.navigate('Login', { userType: 'Lawyer' })
          }>
          <Text style={styles.buttonText}>Lawyer</Text>
        </TouchableOpacity>
        {/* 
        <Text style={styles.footer}>
          Already have an account?{' '}
          <Text
            style={styles.loginText}
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Text>
        </Text> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    paddingBottom: width *0.087,
    backgroundColor: 'white'
  },
  overlay: {
    // flex: 1,
    // backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width *0.052,
    paddingBottom:width *0.052,

  },

  heading: {
    fontSize: width *0.060,
    fontFamily: 'Marathon-Serial Bold',
    marginBottom: width *0.052,
    color: '#A4A9AE',
  },
  button: {
    width: '90%',
    paddingVertical: width *0.036,
    borderRadius: width *0.047,
    alignItems: 'center',
    // justifyContent:'center',
    marginBottom: width *0.039,
    // fontFamily:'Poppins-Regular'
  },
  clientButton: {
    backgroundColor: '#337DBD',
  },
  assistantButton: {
    backgroundColor: '#0F5189',
  },
  lawyerButton: {
    backgroundColor: '#EAA141',
  },
  buttonText: {
    fontSize: width *0.040,
    color: '#fff',
    fontFamily: 'Poppins-Regular'
    // fontWeight: 'bold',
  },
  footer: {
    marginTop: 0,
    fontSize: width *0.040,
    color: '#666',
  },
  loginText: {
    color: '#003366',
    fontWeight: 'bold',
  },
});
