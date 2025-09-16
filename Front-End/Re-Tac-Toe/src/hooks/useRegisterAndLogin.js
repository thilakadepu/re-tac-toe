import { useState } from 'react';
import { saveToken } from '../services/authToken';
import { registerGuest } from '../services/api';

export default function useRegisterAndLogin(onLoginSuccess) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [player1Name, setPlayer1Name] = useState(null);

  const handleRegisterAndLogin = (values) => {
    const payload = {
      displayName: values.name,
    };

    registerGuest(payload)
      .then((loginResponse) => {
        const token = loginResponse.data.token;
        saveToken(token);
        setPlayer1Name(values.name);
        setIsSubmitted(true);
        onLoginSuccess(values.name, "Player");
      })
      .catch((error) => {
        console.error("Registration failed : ", error);
      })
  };

  return {
    handleRegisterAndLogin,
    isSubmitted,
    player1Name
  };
}
