class RecordedUserDTO {
  id: number;
  name: string
  email: string;

  constructor (name: string, email: string, id: number) {
    this.name = name
    this.email = email
    this.id = id
  }
}

export default RecordedUserDTO
