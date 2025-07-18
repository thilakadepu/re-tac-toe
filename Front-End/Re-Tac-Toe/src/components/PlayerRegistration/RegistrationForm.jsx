import { Form, Formik } from "formik"
import { AnimatePresence } from "framer-motion"

import EditablePlayerCardSection from "./EditablePlayerCardSection"
import PlayerCardDisplay from "./PlayerCardDisplay"

export default function RegistrationForm({ avatar, isDuplicateUserName, isSubmitted, player1Name, onSubmit}) {
  return (
    <Formik initialValues={{name: ''}} onSubmit={onSubmit}>
      <Form className={`transition-wrapper ${isSubmitted ? 'show' : 'hide'} registration-form`}>
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <EditablePlayerCardSection avatar={avatar} isDuplicateUserName={isDuplicateUserName}/>
          ) : (
            <PlayerCardDisplay avatar={avatar} isDuplicateUserName = {isDuplicateUserName} player1Name={player1Name} />
          )}
        </AnimatePresence>
        <button type='submit' className="play-btn">
          {!isSubmitted ? "Play" : "Connecting ..."}
        </button>
      </Form>
    </Formik> 
  )
}