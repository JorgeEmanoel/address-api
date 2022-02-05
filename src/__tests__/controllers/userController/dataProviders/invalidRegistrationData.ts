interface IRegistrationData {
  name?: string
  email?: string
  password?: string
  passwordConfirmation?: string
}

interface IInvalidData {
  description: string
  body: IRegistrationData
}

const invalidData: IInvalidData[] = [
  {
    description: 'Should not accept when missing name',
    body: {
      email: 'teste@email.com',
      password: '12345678',
      passwordConfirmation: '12345678'
    }
  },
  {
    description: 'Should not accept when missing e-mail',
    body: {
      name: 'John Doe',
      password: '12345678',
      passwordConfirmation: '12345678'
    }
  },
  {
    description: 'Should not accept when missing password',
    body: {
      name: 'John Doe',
      email: 'johndoe@email.com',
      passwordConfirmation: '12345678'
    }
  },
  {
    description: 'Should not accept when missing password confirmation',
    body: {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678'
    }
  },
  {
    description: 'Should not accept an invalid e-mail (missing @)',
    body: {
      name: 'John Doe',
      email: 'johndoeemail.com',
      password: '12345678',
      passwordConfirmation: '12345678'
    }
  },
  {
    description: 'Should not accept an invalid e-mail (missing domain)',
    body: {
      name: 'John Doe',
      email: 'johndoe@email',
      password: '12345678',
      passwordConfirmation: '12345678'
    }
  }
]

export {
  IInvalidData,
  IRegistrationData
}

export default invalidData
