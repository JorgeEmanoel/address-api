interface IDatabaseConnection {
  disconnect: () => void
  test: () => Promise<boolean>
}

export default IDatabaseConnection
