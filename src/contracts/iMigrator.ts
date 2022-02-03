interface IMigrator {
  migrate: (fn: () => void | null) => void
}

export default IMigrator
