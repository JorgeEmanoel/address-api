import { expect } from 'chai'
import { Server } from 'http'
import sinon, { SinonSandbox } from 'sinon'
import supertest, { SuperAgentTest } from 'supertest'
import jwt from 'jsonwebtoken'
import boostrap from '../../../app'
import Response from '../../../constants/http/response'
import UserRepository from '../../../repositories/userRepository'
import UserDTO from '../../../dto/userDto'
import Hasher from '../../../security/hasher'
import { auth as AuthConfig } from '../../../config'
import AddressRepository from '../../../repositories/addressRepository'
import AddressDTO from '../../../dto/addressDto'

let server: Server | null = null
let request: SuperAgentTest | null = null

const userData = {
  id: 2022,
  name: 'John Doe',
  email: 'johndoe@domain.com',
  password: '12345678'
}

const validData = {
  neightborhood: 'Neightborhood',
  city: 'City Name',
  state: 'PE',
  postalCode: '50000000',
  id: 2022
}

const addressDto = new AddressDTO(
  validData.neightborhood,
  validData.city,
  validData.state,
  validData.postalCode,
  validData.id
)

const userToken = jwt.sign({
  id: userData.id
}, AuthConfig.jwt.secret, {
  expiresIn: AuthConfig.jwt.timeout
})

const hasher = new Hasher()

function makeRequest () {
  return request?.get(`/addresses/${validData.id}`)
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', userToken)
}

describe.only('AddressController => show', function () {
  let sandbox: SinonSandbox
  before(async function () {
    const { app } = await boostrap([])

    server = app.listen()
    request = supertest.agent(server)
  })

  after(function () {
    server?.close()
  })

  beforeEach(function () {
    sandbox = sinon.createSandbox()
    sandbox.stub(UserRepository.prototype, 'find').resolves({
      user: new UserDTO(
        userData.name,
        userData.email,
        userData.id
      ),
      password: hasher.make(userData.password)
    })
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('Should not return anything when no address is found', async function () {
    sandbox.stub(AddressRepository.prototype, 'find').resolves(null)
    const res = await makeRequest()

    expect(res?.status).to.be.equals(Response.HTTP_NOT_FOUND)
    expect(res?.body).not.to.have.property('neightborhood')
    expect(res?.body).not.to.have.property('city')
    expect(res?.body).not.to.have.property('state')
    expect(res?.body).not.to.have.property('postalCode')
    expect(res?.body).not.to.have.property('id')
    expect(res?.body).not.to.have.property('errors')
  })

  it.only('Should return the given address', async function () {
    const spy = sandbox.stub(AddressRepository.prototype, 'find').resolves(addressDto)
    const res = await makeRequest()

    expect(spy.withArgs({ id: addressDto.id, userId: userData.id }).calledOnce).to.be.equals(true)
    expect(res?.status).to.be.equals(Response.HTTP_OK)
    expect(res?.body).to.have.property('neightborhood', addressDto.neightborhood)
    expect(res?.body).to.have.property('city', addressDto.city)
    expect(res?.body).to.have.property('state', addressDto.state)
    expect(res?.body).to.have.property('postalCode', addressDto.postalCode)

    spy.restore()
  })
})
