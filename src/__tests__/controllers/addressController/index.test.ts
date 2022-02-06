import { expect } from 'chai'
import { Server } from 'http'
import sinon, { SinonSandbox, SinonSpy } from 'sinon'
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
  return request?.get('/addresses')
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', userToken)
}

describe('AddressController => index', function () {
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

  it('Should return and empty list when no address is found', async function () {
    sandbox.stub(AddressRepository.prototype, 'all').resolves([])
    const res = await makeRequest()

    expect(res?.status).to.be.equals(Response.HTTP_OK)
    expect(res?.body).to.have.property('addresses')
  })

  it('Should return the addresses list', async function () {
    const spy = sandbox.stub(AddressRepository.prototype, 'all').resolves([addressDto, addressDto])
    const res = await makeRequest()

    expect(spy.withArgs({ userId: userData.id }).calledOnce).to.be.equals(true)
    expect(res?.status).to.be.equals(Response.HTTP_OK)
    expect(res?.body).to.have.property('addresses')
    expect(res?.body.addresses.length).to.be.equals(2)
    expect(res?.body.addresses[0]).to.have.property('neightborhood', addressDto.neightborhood)
    expect(res?.body.addresses[0]).to.have.property('city', addressDto.city)
    expect(res?.body.addresses[0]).to.have.property('state', addressDto.state)
    expect(res?.body.addresses[0]).to.have.property('postalCode', addressDto.postalCode)
    expect(res?.body.addresses[0]).to.have.property('id', addressDto.id)

    expect(res?.body.addresses[1]).to.have.property('neightborhood', addressDto.neightborhood)
    expect(res?.body.addresses[1]).to.have.property('city', addressDto.city)
    expect(res?.body.addresses[1]).to.have.property('state', addressDto.state)
    expect(res?.body.addresses[1]).to.have.property('postalCode', addressDto.postalCode)
    expect(res?.body.addresses[1]).to.have.property('id', addressDto.id)

    spy.restore()
  })

  describe('Should accept query params', async function () {
    let spy: SinonSpy
    let queryParamsSandbox: SinonSandbox

    before(function () {
      queryParamsSandbox = sinon.createSandbox()
      spy = queryParamsSandbox.stub(AddressRepository.prototype, 'all').resolves([addressDto])
    })

    after(function () {
      queryParamsSandbox.restore()
    })

    const queries = [
      {
        neightborhood: 'Some neightborhood'
      },
      {
        city: 'Some city'
      },
      {
        state: 'Some state'
      },
      {
        postalCode: 'Some postalCode'
      }
    ]

    queries.forEach(function (query) {
      it(`Should filter by ${Object.keys(query).toString()}`, async function () {
        await makeRequest()?.query(query)
        expect(spy.withArgs({
          userId: userData.id,
          ...query
        }).calledOnce).to.be.equals(true)
      })
    })
  })
})
