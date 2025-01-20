import { toast } from 'react-toastify';

<<<<<<< HEAD
const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: {
    marginTop: '4rem'
  }
};

export const showNotification = {
  success: (message) => {
    toast.success(message, toastConfig);
  },
  error: (message) => {
    toast.error(message, toastConfig);
  },
  info: (message) => {
    toast.info(message, toastConfig);
  },
  warning: (message) => {
    toast.warning(message, toastConfig);
=======
export const showNotification = {
  success: (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },
  error: (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },
  info: (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },
  warning: (message) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
>>>>>>> 1c2342d (wallet and review fixed)
  }
}; 