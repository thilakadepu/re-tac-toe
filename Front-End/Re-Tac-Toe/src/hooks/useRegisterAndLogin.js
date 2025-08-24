import { useState } from 'react';
import { registerUser, loginUser } from '../services/api';
import { saveToken } from '../services/authToken';

export default function useRegisterAndLogin(onLoginSuccess) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDuplicateUserName, setIsDuplicateUserName] = useState(false);
  const [player1Name, setPlayer1Name] = useState(null);

  const handleRegisterAndLogin = (values) => {
    const payload = {
      username: values.name,
      password: values.name
    };

    registerUser(payload)
      .then(() => loginUser(payload))
      .then((loginResponse) => {
        const token = loginResponse.data.token;
        saveToken(token);
        setPlayer1Name(values.name);
        setIsSubmitted(true);
        onLoginSuccess(payload.username, "Player");
      })
      .catch((error) => {
        console.error("Registration or login failed:", error);
        setIsDuplicateUserName(true);
      });
  };

  return {
    handleRegisterAndLogin,
    isSubmitted,
    isDuplicateUserName,
    player1Name
  };
}
