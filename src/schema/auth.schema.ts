import * as yup from 'yup'

// Sign-in is by school ID number (faculty / staff / student / admin), not by
// username — the ID is what everyone already carries on their card.
export const idNumberValidator = yup
  .string()
  .required('ID number is required')
  .min(2, 'ID number must be at least 2 characters')
  .max(50, 'ID number must not exceed 50 characters')

export const passwordValidator = yup
  .string()
  .required('Password is required')

export default yup.object({
  id_number: idNumberValidator,
  password: passwordValidator,
})
