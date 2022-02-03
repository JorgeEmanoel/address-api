interface IRepository<T, CP, SP, UP, FP, FR> {
  count: (attributes: CP) => Promise<number>
  find: (attributes: FP) => Promise<FR | null>
  store: (data: SP) => Promise<T>
  update: (id: number, data: UP) => Promise<T | null>
}

export default IRepository
