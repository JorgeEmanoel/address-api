interface ILoginData {
  email?: string
  password?: string
}

interface IInvalidData {
  description: string
  body: ILoginData
}

const invalidData: IInvalidData[] = [
  {
    description: 'Should not accept missing e-mail',
    body: {
      password: '12345678'
    }
  },
  {
    description: 'Should not accept missing password',
    body: {
      email: 'johndoe@domain.com'
    }
  }
]

export {
  IInvalidData,
  ILoginData
}

export default invalidData
