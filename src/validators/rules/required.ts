import IRulable from '../../contracts/iRulable'

class RequiredRule implements IRulable<unknown> {
  value: unknown = null

  withValue (value: unknown) {
    this.value = value
    return this
  }

  isValid (data: unknown) {
    return typeof data !== 'undefined' &&
      data !== null
  }

  message (fieldName: string) {
    return `The field ${fieldName} is required`
  }
}

export default RequiredRule
