import IRulable from '../../contracts/iRulable'

class MaxRule implements IRulable<string | number> {
  value: string | number

  constructor () {
    this.value = Number.POSITIVE_INFINITY
  }

  withReference (value?: string | number) {
    this.value = String(value)
    return this
  }

  isValid (data: string | number) {
    if (typeof data === 'string') {
      return data.length <= this.value
    }

    return Number(data) <= this.value
  }

  message (fieldName: string) {
    return `The field ${fieldName} must have up to ${this.value} chars`
  }
}

export default MaxRule
