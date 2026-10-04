import * as yup from 'yup'

import { passwordIssues } from '@/lib/password-policy'

// Sign-in is by school ID number (faculty / staff / student / admin), not by
// username — the ID is what everyone already carries on their card.
export const idNumberValidator = yup
  .string()
  .required('ID number is required')
  .min(2, 'ID number must be at least 2 characters')
  .max(50, 'ID number must not exceed 50 characters')

// Reports the first rule broken, so the form shows one message at a time.
export const passwordValidator = yup
  .string()
  .required('Password is required')
  .test('password-policy', function (value) {
    const [issue] = passwordIssues(value ?? '')
    return issue ? this.createError({ message: issue }) : true
  })

export default yup.object({
  id_number: idNumberValidator,
  password: passwordValidator,
})
