import { Form, Formik } from "formik"
import { AnimatePresence } from "framer-motion"

import EditablePlayerCardSection from "./EditablePlayerCardSection"
import PlayerCardDisplay from "./PlayerCardDisplay"
import { useEffect, useState } from "react"
import { getRandomImageName } from "../../helpers/imageHelper"

export default function RegistrationForm({ isDuplicateUserName, isSubmitted, player1Name, onSubmit}) {
  const [avatar, setAvatar] = useState(null);
  const [isConnected, setIsConnected] = useState(false)

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
            <PlayerCardDisplay avatar={avatar} isDuplicateUserName = {isDuplicateUserName} player1Name={player1Name} setIsConnected={setIsConnected} />
          )}
        </AnimatePresence>
        <button type='submit' className="play-btn">
          {!isConnected ? (!isSubmitted ? "Play" : "Connecting ...") : "Connected"}
        </button>
      </Form>
    </Formik> 
  )
}