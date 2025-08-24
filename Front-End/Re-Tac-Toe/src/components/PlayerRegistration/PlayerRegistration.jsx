import { useContext, useState } from 'react';
import RegistrationForm from './RegistrationForm';
import '../PlayerRegistration/PlayerRegistration.css';
import { AuthContext } from '../../context/AuthContext.jsx';
import useRegisterAndLogin from '../../hooks/useRegisterAndLogin';
import { getToken } from '../../services/authToken';
import { getRandomImageName } from '../../helpers/imageHelper';
import PlayerCardDisplay from './PlayerCardDisplay.jsx';

export default function PlayerRegistration() {
  const { login } = useContext(AuthContext);
  const token = getToken();
  const [avatar, setAvatar] = useState(getRandomImageName());
  const [playerName, setPlayerName] = useState(sessionStorage.getItem("playerName"));
  const [isMatchFound, setIsMatchFound] = useState(false);

  const {
    handleRegisterAndLogin,
    isSubmitted,
    isDuplicateUserName,
    player1Name
  } = useRegisterAndLogin((username) => {
    login(username, "Player");
    sessionStorage.setItem("playerName", username);
    setPlayerName(username);
  });

  if (token && playerName) {
    return (
      <main>
        <PlayerCardDisplay
          avatar={avatar}
          player1Name={playerName}
          setIsMatchFound={setIsMatchFound}
        />
      </main>
    );
  }

  return (
    <main>
      <RegistrationForm
        isDuplicateUserName={isDuplicateUserName}
        isSubmitted={isSubmitted}
        player1Name={player1Name}
        onSubmit={handleRegisterAndLogin}
        avatar={avatar}
        setAvatar={setAvatar}
        isMatchFound={isMatchFound}
        setIsMatchFound={setIsMatchFound}
      />
    </main>
  );
}
