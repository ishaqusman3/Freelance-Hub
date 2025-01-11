import { toast } from 'react-toastify';

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
  }
}; 