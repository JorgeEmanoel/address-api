interface IRepository<T, CP, SP, UP, FP, FR> {
  count: (attributes: CP) => Promise<number>
  find: (attributes: FP) => Promise<FR | null>
  all: (attributes: FP) => Promise<T[] | null>
  store: (data: SP) => Promise<T>
  update: (id: number, data: UP) => Promise<T | null>
  delete: (id: number) => Promise<T | null>
}

export default IRepository
