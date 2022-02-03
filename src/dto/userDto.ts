class UserDTO {
  id?: number | undefined;
  name: string
  email: string;

  constructor (name: string, email: string, id: number | undefined = undefined) {
    this.name = name
    this.email = email
    this.id = id
  }
}

export default UserDTO
