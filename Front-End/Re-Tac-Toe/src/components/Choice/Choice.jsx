import { useEffect, useState } from 'react';

import './Choice.css';
import { sendChoice, subscribeToChoice, subscribeToToken } from '../../services/connection';
import ButtonChoice from '../ButtonChoice/ButtonChoice';
import DivChoice from '../DivChoice/DivChoice';

const ROLE_CHOOSER = 'CHOOSER';

export default function Choice({ currentPlayerName, roomId }) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [delayedSelectedChoice, setDelayedSelectedChoice] = useState(null);
  const [isChooser, setIsChooser] = useState(false);
  const [roleReceived, setRoleReceived] = useState(false);

  useEffect(() => {
    const handleChoice = (data) => {
      setIsChooser(data.role === ROLE_CHOOSER);
      setRoleReceived(true);
    };

    subscribeToChoice(handleChoice);
  }, []);

  useEffect(() => {
    const handleSubscribeToToken = (data) => {
      setSelectedChoice(data.token);
    };

    subscribeToToken(handleSubscribeToToken);
  }, []);

  useEffect(() => {
    if (selectedChoice === null) {
      setDelayedSelectedChoice(null);
      return;
    }

    const timeout = setTimeout(() => {
      setDelayedSelectedChoice(selectedChoice);
    }, 800); 

    return () => clearTimeout(timeout);
  }, [selectedChoice]);

  const handleSelectChoice = (choice) => {
    if (selectedChoice || !isChooser) return;

    setSelectedChoice(choice);

    const payload = {
      roomId,
      username: currentPlayerName,
      choiceToken: choice,
    };

    sendChoice(payload);
  };

  let headingText;

  if (delayedSelectedChoice) {
    headingText = `${currentPlayerName}'s choice`;
  } else if (roleReceived) {
    headingText = isChooser ? "Pick a choice" : "Opponent is picking";
  } else {
    headingText = "Waiting";
  }

  let renderedChoices;

  if (delayedSelectedChoice) {
    renderedChoices = <DivChoice element={delayedSelectedChoice} extraClass="selected" />;
  } else if (roleReceived && isChooser) {
    renderedChoices = (
      <>
        <ButtonChoice
          element="X"
          handleSelectChoice={handleSelectChoice}
          selectedChoice={selectedChoice}
        />
        <ButtonChoice
          element="O"
          handleSelectChoice={handleSelectChoice}
          selectedChoice={selectedChoice}
        />
      </>
    );
  } else {
    renderedChoices = (
      <>
        <DivChoice element="X" />
        <DivChoice element="O" />
      </>
    );
  }

  const oppositeClass =
  delayedSelectedChoice === 'X' ? 'O' :
  delayedSelectedChoice === 'O' ? 'X' :
  '';


  return (
    <section className="choice-app-container">
      <article className="choice-card">
        <h1 className={oppositeClass}>
          {headingText}
        </h1>
        <div className="button-container">
          {renderedChoices}
        </div>
      </article>
    </section>
  );
}
