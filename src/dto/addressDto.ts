class AddressDTO {
  id?: number | undefined;
  neightborhood: string
  city: string;
  state: string;
  postalCode: string;

  constructor (
    neightborhood: string,
    city: string,
    state: string,
    postalCode: string,
    id: number | undefined = undefined
  ) {
    this.neightborhood = neightborhood
    this.city = city
    this.state = state
    this.postalCode = postalCode
    this.id = id
  }
}

export default AddressDTO
