import IRulable from '../../contracts/iRulable'

class RequiredRule implements IRulable<unknown> {
  value: unknown = null

  withValue (value?: unknown) {
    this.value = value
    return this
  }

  isValid (data: unknown) {
    return typeof data !== 'undefined' &&
      data !== null &&
      String(data).length > 0
  }

  message (fieldName: string) {
    return `The field ${fieldName} is required`
  }
}

export default RequiredRule
