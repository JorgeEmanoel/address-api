interface IRulable<T> {
  value: T
  withValue: (param: T) => IRulable<T>
  isValid: (data: T) => boolean
  message: (fieldName: string) => string
}

export default IRulable
