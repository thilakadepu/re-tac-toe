import { Form, Formik } from "formik"
import { AnimatePresence } from "framer-motion"

import EditablePlayerCardSection from "./EditablePlayerCardSection"
import PlayerCardDisplay from "./PlayerCardDisplay"
import { useEffect, useState } from "react"
import { getRandomImageName } from "../../helpers/imageHelper"

export default function RegistrationForm({ isDuplicateUserName, isSubmitted, player1Name, onSubmit}) {
  const [avatar, setAvatar] = useState(null);
  const [isMatchFound, setIsMatchFound] = useState(false)

  useEffect(() => {
    setAvatar(getRandomImageName())
  }, [])

  return (
    <Formik initialValues={{name: ''}} onSubmit={onSubmit}>
      <Form className={`transition-wrapper ${isSubmitted ? 'show' : 'hide'} registration-form`}>
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <EditablePlayerCardSection avatar={avatar} isDuplicateUserName={isDuplicateUserName}/>
          ) : (
            <PlayerCardDisplay avatar={avatar} isDuplicateUserName = {isDuplicateUserName} player1Name={player1Name} setIsMatchFound={setIsMatchFound} />
          )}
        </AnimatePresence>
        <button type='submit' className="play-btn">
          {!isMatchFound ? (!isSubmitted ? "Play" : "Matching ....") : "Match Found"}
        </button>
      </Form>
    </Formik> 
  )
}