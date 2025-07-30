import React from 'react';
import toast, { Toaster } from "react-hot-toast";
import Colors from '../../assets/styles';


function ToasterContainer() {
  return (
    <Toaster
      position={'top-center'}
    />
  )
};

export const SuccessToaster = (message) => {
  toast.success(message, {
    style: {
      backgroundColor: Colors.darkGray1,
      color: Colors.white,
    },
  });
};

export const ErrorToaster = (message) => {
  toast.error(message, {
    style: {
      backgroundColor: Colors.darkGray1,
      color: Colors.white,
    },
  });
};

export default ToasterContainer
