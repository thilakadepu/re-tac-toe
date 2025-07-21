import { useState, useEffect, useContext } from 'react';

import { getRandomImageName} from '../../helpers/imageHelper';
import RegistrationForm from './RegistrationForm';
import '../PlayerRegistration/PlayerRegistration.css';
import { loginUser, registerUser } from '../../services/api.js';
import { saveToken } from '../../services/authToken.js';
import { AuthContext } from '../../context/AuthContext.jsx';

export default function PlayerRegistration() {

  const { login } = useContext(AuthContext)
  const [avatar, setAvatar] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [player1Name, setPlayer1Name] = useState(null)
  const [isDuplicateUserName, setIsDuplicateUserName] = useState(false)

  useEffect(() => {
    setAvatar(getRandomImageName());
  }, [])

  // On isSubmitted true

  const handleSubmit = (values) => {
    const payload = {
      username: values.name,
      password: values.name
    };

    registerUser(payload)
      .then(() => {
        return loginUser(payload);
      })
      .then((loginResponse) => {
        const token = loginResponse.data.token;
        saveToken(token);
        login(payload.username, "Player")
        setPlayer1Name(values.name);
        setIsSubmitted(true);
      })
      .catch((error) => {
        // Here if it is error it is setting the user to duplicate 
        // If backend is not connected also
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
