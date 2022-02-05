interface IUpdateData {
  name?: string
  email?: string
  password?: string
}

interface IInvalidData {
  description: string
  body: IUpdateData
}

const invalidData: IInvalidData[] = [
  {
    description: 'Should not accept when missing name',
    body: {
      email: 'teste@email.com',
      password: '12345678'
    }
  },
  {
    description: 'Should not accept when missing e-mail',
    body: {
      name: 'John Doe',
      password: '12345678'
    }
  },
  {
    description: 'Should not accept when missing password',
    body: {
      name: 'John Doe',
      email: 'johndoe@email.com'
    }
  },
  {
    description: 'Should not accept an invalid e-mail (missing @)',
    body: {
      name: 'John Doe',
      email: 'johndoeemail.com',
      password: '12345678'
    }
  },
  {
    description: 'Should not accept an invalid e-mail (missing domain)',
    body: {
      name: 'John Doe',
      email: 'johndoe@email',
      password: '12345678'
    }
  }
]

export {
  IInvalidData,
  IUpdateData
}

export default invalidData
