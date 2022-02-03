interface IRepository<T, SP> {
  count: (attributes: object) => Promise<number>
  // findOne: (id: number) => Promise<T | null>
  store: (data: SP) => Promise<T>
  // update: (id: number, data: object) => Promise<boolean>
  // delete: (id: number) => Promise<T>
}

export default IRepository
