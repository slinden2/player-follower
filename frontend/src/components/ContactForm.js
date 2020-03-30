import React, { useContext, useRef } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Formik } from 'formik'
import Reaptcha from 'reaptcha'
import { event } from '../utils/tracking'
import { NotificationContext } from '../contexts/NotificationContext'
import { SEND_CONTACT_FORM } from '../graphql/mutations'
import PageContainer from './elements/PageContainer'
import ContentWrapper from './elements/ContentWrapper'
import {
  Container,
  SForm,
  SField,
  Label,
  Input,
  TextArea,
  ReCaptchaContainer,
} from '../styles/forms'
import FormError from './user/FormError'
import { contactSchema } from './user/validationSchemas'
import Notification from './Notification'
import Button from './elements/Button'
import colors from '../styles/colors'
import config from '../config'

const ContactForm = ({ history }) => {
  const { notification, setNotification, handleException } = useContext(
    NotificationContext
  )
  const sendContactForm = useMutation(SEND_CONTACT_FORM)
  const recaptchaRef = useRef(null)

  const handleSubmitForm = async (
    { name, email, subject, message, recaptcha },
    { resetForm, setSubmitting }
  ) => {
    try {
      await sendContactForm({
        variables: { name, email, subject, message, recaptcha },
      })
      setNotification(
        'positive',
        'Thanks for the feedback. I will get back to you as soon as possible.',
        'site'
      )
      event('FORM', 'Contact Form Submit')
      history.push('/')
    } catch (exception) {
      handleException(exception, 'form')
      resetForm()
      setSubmitting(false)
      recaptchaRef.current.reset()
    }
  }

  const handleCancel = () => {
    history.push('/')
  }

  return (
    <PageContainer title='Contact'>
      <ContentWrapper>
        <Container>
          <Formik
            initialValues={{
              name: '',
              email: '',
              subject: '',
              message: '',
              recaptcha: '',
            }}
            validationSchema={contactSchema}
            onSubmit={handleSubmitForm}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleChange,
              handleBlur,
              setFieldValue,
            }) => {
              return (
                <SForm>
                  <SField>
                    <Label htmlFor='name'>Name</Label>
                    <Input
                      name='name'
                      type='text'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    <FormError
                      message={errors.name}
                      show={errors.name && touched.name}
                    />
                  </SField>
                  <SField>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      name='email'
                      type='email'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    <FormError
                      message={errors.email}
                      show={errors.email && touched.email}
                    />
                  </SField>
                  <SField>
                    <Label htmlFor='subject'>Subject</Label>
                    <Input
                      name='subject'
                      type='text'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.subject}
                    />
                    <FormError
                      message={errors.subject}
                      show={errors.subject && touched.subject}
                    />
                  </SField>
                  <SField>
                    <Label htmlFor='message'>Message</Label>
                    <TextArea
                      name='message'
                      component='textarea'
                      type='text'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.message}
                    />
                    <FormError
                      message={errors.message}
                      show={errors.message && touched.message}
                    />
                  </SField>
                  <br />
                  <Notification position='form' notification={notification} />
                  <br />
                  <ReCaptchaContainer>
                    <Reaptcha
                      ref={recaptchaRef}
                      sitekey={config.RECAPTCHA_SITE_KEY}
                      onVerify={token => setFieldValue('recaptcha', token)}
                      theme='dark'
                    />
                  </ReCaptchaContainer>
                  <FormError
                    message={errors.recaptcha}
                    show={
                      errors.recaptcha &&
                      touched.name &&
                      touched.email &&
                      touched.subject &&
                      touched.message
                    }
                  />
                  <br />
                  <Button
                    type='submit'
                    size='big'
                    fontCase='uppercase'
                    content='Send'
                    disabled={isSubmitting}
                    style={{ marginRight: '10px' }}
                    dataCy='send-button'
                  />
                  <Button
                    type='button'
                    size='big'
                    fontCase='uppercase'
                    content='Cancel'
                    color={colors.red1}
                    onClick={handleCancel}
                    style={{ marginLeft: '10px' }}
                    dataCy='cancel-button'
                  />
                </SForm>
              )
            }}
          </Formik>
        </Container>
      </ContentWrapper>
    </PageContainer>
  )
}

export default ContactForm
