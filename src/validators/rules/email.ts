import IRulable from '../../contracts/iRulable'

class EmailRule implements IRulable<unknown> {
  value: unknown = undefined

  withValue (value?: unknown) {
    this.value = value
    return this
  }

  isValid (data: unknown) {
    const [name, domain] = String(data).split('@')

    if (!name || !domain) {
      return false
    }

    const [site, term] = domain.split('.')

    if (!site || !term) {
      return false
    }

    return true
  }

  message (fieldName: string) {
    return `The field ${fieldName} must be a valid email address`
  }
}

export default EmailRule
