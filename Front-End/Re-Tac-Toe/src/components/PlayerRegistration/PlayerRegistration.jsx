import { useState, useEffect } from 'react';

import { getRandomImageName} from '../../helpers/imageHelper';
import RegistrationForm from './RegistrationForm';
import '../PlayerRegistration/PlayerRegistration.css';
import { loginUser, registerUser } from '../../services/api.js';
import { saveToken } from '../../services/authToken.js';

export default function PlayerRegistration() {

  const [avatar, setAvatar] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [player1Name, setPlayer1Name] = useState(null)
  const [isDuplicateUserName, setIsDuplicateUserName] = useState(false)

  useEffect(() => {
    setAvatar(getRandomImageName());
  }, [])

  const handleSubmit = (values) => {
    const payload = {
      username: values.name,
      password: values.name
    };

    registerUser(payload)
      .then(() => {
        // console.log('Registration Successful');
        return loginUser(payload);
      })
      .then((loginResponse) => {
        // console.log('Login Successful, JWT:', loginResponse.data.token);
        const token = loginResponse.data.token;
        saveToken(token);
        setPlayer1Name(values.name);
        setIsSubmitted(true);
      })
      .catch((error) => {
        console.error('Registration or Login unsuccessful', error);
        setIsDuplicateUserName(true)
      });
  };

  return (
    <main>
      <RegistrationForm
        avatar={avatar}
        isDuplicateUserName = {isDuplicateUserName}
        isSubmitted={isSubmitted}
        player1Name={player1Name}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
