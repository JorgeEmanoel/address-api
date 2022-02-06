import IRulable from '../../contracts/iRulable'

class MinRule implements IRulable<string | number> {
  value: string | number

  constructor () {
    this.value = Number.NEGATIVE_INFINITY
  }

  withValue (value?: string | number) {
    this.value = String(value)
    return this
  }

  isValid (data: string | number) {
    if (typeof data === 'string') {
      return data.length >= this.value
    }

    return Number(data) >= this.value
  }

  message (fieldName: string) {
    return `The field ${fieldName} must have at least ${this.value} chars`
  }
}

export default MinRule
