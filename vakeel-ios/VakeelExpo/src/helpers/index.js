import axios from "axios";
import { Apis } from "../services/Endpoints";
import { enviroment } from "../environment";
import messaging from '@react-native-firebase/messaging';
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid } from "react-native";

export const getDocumentUrl = async (documents) => {
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
  let result;

  try {
    // Check for oversized files
    const oversizedFiles = documents.filter(
      (file) => file.size && file.size > MAX_FILE_SIZE
    );

    if (oversizedFiles.length > 0) {
      return "One or more files are too big. Please upload files smaller than 50 MB.";
    }

    // Map selected files to the correct format
    const selectedFiles = documents.map((file) => ({
      uri: file.uri || file.path,
      type: file.type || file.mime,
      name: file.name || file.path?.split('/').pop(),
    }));

    // Create FormData and append files
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("document", {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
    });

    // Perform the upload request
    const response = await axios.post(
      `${enviroment.API_URL}${Apis.uploadDocument}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // Extract the file path from the response
    result = response.data?.data?.path;
  } catch (error) {
    console.error("Error uploading document:", error);
    result = "Error uploading document";
  }

  return result;
};
export const getMultipleDocumentUrl = async (document) => {
  try {
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
    const oversizedFiles = document.filter(file => file.size && file.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      return "File is too big. Please upload a file smaller than 50 MB.";
    }
    const selectedFiles = document.map(file => ({
      uri: file?.uri || file?.path,
      type: file?.type || file?.mime,
      name: file?.name?.replace(/-/g, '_') || file?.path?.split('/').pop()?.replace(/-/g, '_')||file?.fileName?.split('/').pop()?.replace(/-/g, '_'),
    }));
    
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append("document", {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
    });

    const response = await axios.post(
      `${enviroment.API_URL}${Apis.uploadDocument}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // Normalize the response to always be an array
    const responseData = response.data?.data?.path;
    return Array.isArray(responseData) ? responseData : [responseData];
  } catch (error) {
    console.error("Error uploading document:", error);
    return "Error uploading document";
  }
};

  export  const showToast = (type,text) => {
    Toast.show({
      type: type,
      text1: text,
    });
  }
  export const getDataLocally = async () => {
    try {
      const result = await AsyncStorage.getItem('UserLocalData');
      return result != null ? JSON.parse(result) : null;
    } catch (e) {
      // error reading value
    }
  };
  export const clearLocalStorage = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
  }
  export const getFirebaseToken = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
     let token =  await messaging().getToken();
    return token;
  };
  export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  export const requestCameraPermission = async () => {
      try {
        const storageGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Cool Photo App Storage Permission',
            message:
              'Cool Photo App needs access to your storage ' +
              'so you can save awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
  
        if (storageGranted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission denied');
          return;
        }
  
        const cameraGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Cool Photo App Camera Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
  
        if (cameraGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };