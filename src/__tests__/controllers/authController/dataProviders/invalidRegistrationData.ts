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
    description: 'Missing name',
    body: {
      email: 'teste@email.com',
      password: '123456',
      passwordConfirmation: '123456'
    }
  },
  {
    description: 'Missing e-mail',
    body: {
      name: 'John Doe',
      password: '123456',
      passwordConfirmation: '123456'
    }
  },
  {
    description: 'Missing password',
    body: {
      name: 'John Doe',
      email: 'johndoe@email.com',
      passwordConfirmation: '123456'
    }
  },
  {
    description: 'Missing password confirmation',
    body: {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456'
    }
  },
  {
    description: 'Invalid e-mail (missing @)',
    body: {
      name: 'John Doe',
      email: 'johndoeemail.com',
      password: '123456',
      passwordConfirmation: '123456'
    }
  },
  {
    description: 'Invalid e-mail (missing domain)',
    body: {
      name: 'John Doe',
      email: 'johndoe@email',
      password: '123456',
      passwordConfirmation: '123456'
    }
  }
]

export {
  IInvalidData,
  IRegistrationData
}

export default invalidData
