interface IRulable<T> {
  value: T
  withReference: (param?: T) => IRulable<T>
  isValid: (data: T) => boolean
  message: (fieldName: string) => string
}

export default IRulable
