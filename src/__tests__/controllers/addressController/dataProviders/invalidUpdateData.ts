interface IUpdateData {
  neightborhood?: string
  city?: string
  state?: string
  postalCode?: string
}

interface IInvalidData {
  description: string
  body: IUpdateData
}

const invalidData: IInvalidData[] = [
  {
    description: 'Should not accept invalid neightborhood (lt 3)',
    body: {
      neightborhood: 'N'.repeat(2)
    }
  },
  {
    description: 'Should not accept invalid neightborhood (gt 200)',
    body: {
      neightborhood: 'N'.repeat(201)
    }
  },
  {
    description: 'Should not accept invalid city (lt 3)',
    body: {
      city: 'N'.repeat(2)
    }
  },
  {
    description: 'Should not accept invalid city (gt 200)',
    body: {
      city: 'N'.repeat(201)
    }
  },
  {
    description: 'Should not accept invalid state (lt 2)',
    body: {
      state: 'N'.repeat(1)
    }
  },
  {
    description: 'Should not accept invalid state (gt 2)',
    body: {
      state: 'N'.repeat(3)
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
  IUpdateData
}

export default invalidData
