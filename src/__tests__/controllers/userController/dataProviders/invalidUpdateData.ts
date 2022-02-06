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
    description: 'Should not accept when invalid name',
    body: {
      name: 'ab'
    }
  },
  {
    description: 'Should not accept when invalid password (min)',
    body: {
      password: '123456'
    }
  },
  {
    description: 'Should not accept when invalid password (max 200)',
    body: {
      password: '#'.repeat(201)
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
