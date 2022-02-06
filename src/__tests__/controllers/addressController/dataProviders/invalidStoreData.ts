interface IStoreData {
  neightborhood?: string
  city?: string
  state?: string
  postalCode?: string
}

interface IInvalidData {
  description: string
  body: IStoreData
}

const invalidData: IInvalidData[] = [
  {
    description: 'Should not accept when missing neightborhood',
    body: {
      city: 'City Name',
      state: 'ST',
      postalCode: '500000000'
    }
  },
  {
    description: 'Should not accept when missing city',
    body: {
      neightborhood: 'Neightborhood',
      state: 'ST',
      postalCode: '500000000'
    }
  },
  {
    description: 'Should not accept when missing state',
    body: {
      neightborhood: 'Neightborhood',
      city: 'City Name',
      postalCode: '500000000'
    }
  },
  {
    description: 'Should not accept when missing postal code',
    body: {
      neightborhood: 'Neightborhood',
      city: 'City Name',
      state: 'ST'
    }
  },
  {
    description: 'Should not accept invalid postal code (lt 8)',
    body: {
      neightborhood: 'Neightborhood',
      city: 'City Name',
      state: 'ST',
      postalCode: '0'.repeat(7)
    }
  },
  {
    description: 'Should not accept invalid postal code (gt 8)',
    body: {
      neightborhood: 'Neightborhood',
      city: 'City Name',
      state: 'ST',
      postalCode: '0'.repeat(9)
    }
  }
]

export {
  IInvalidData,
  IStoreData
}

export default invalidData
