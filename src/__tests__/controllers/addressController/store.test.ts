import { expect } from 'chai'
import { Server } from 'http'
import sinon, { SinonSandbox } from 'sinon'
import supertest, { SuperAgentTest } from 'supertest'
import jwt from 'jsonwebtoken'
import boostrap from '../../../app'
import invalidData, { IStoreData } from './dataProviders/invalidStoreData'
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

const userToken = jwt.sign({
  id: userData.id
}, AuthConfig.jwt.secret, {
  expiresIn: AuthConfig.jwt.timeout
})

const hasher = new Hasher()

function makeRequest (data: IStoreData = {}) {
  return request?.post('/addresses')
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', userToken)
    .send(data)
}

describe('AddressController => store', function () {
  before(async function () {
    const { app } = await boostrap([])

    server = app.listen()
    request = supertest.agent(server)
  })

  after(function () {
    server?.close()
  })

  describe('Invalid Data Validation', function () {
    let invalidSanbdox: SinonSandbox

    before(async function () {
      invalidSanbdox = sinon.createSandbox()
      invalidSanbdox.stub(UserRepository.prototype, 'find').resolves({
        user: new UserDTO(
          userData.name,
          userData.email,
          userData.id
        ),
        password: hasher.make(userData.password)
      })
    })

    after(function () {
      invalidSanbdox.restore()
    })

    invalidData.forEach(function (data) {
      it(data.description, async function () {
        const res = await makeRequest(data.body)
        expect(res?.status).to.be.equals(Response.HTTP_BAD_REQUEST)
        expect(res?.body).to.have.property('errors')
      })
    })
  })

  describe('Valid Data Input', function () {
    let validSandbox: SinonSandbox

    beforeEach(function () {
      validSandbox = sinon.createSandbox()
      validSandbox.stub(UserRepository.prototype, 'find').resolves({
        user: new UserDTO(
          userData.name,
          userData.email,
          userData.id
        ),
        password: hasher.make(userData.password)
      })
    })

    afterEach(function () {
      validSandbox.restore()
    })

    it('Should store and return the stored address', async function () {
      const spy = validSandbox.stub(AddressRepository.prototype, 'store').resolves(
        new AddressDTO(
          validData.neightborhood,
          validData.city,
          validData.state,
          validData.postalCode,
          validData.id
        )
      )

      const res = await makeRequest(validData)
      expect(spy.withArgs({
        neightborhood: validData.neightborhood,
        city: validData.city,
        state: validData.state,
        postalCode: validData.postalCode,
        userId: userData.id
      }).calledOnce).to.be.equals(true)

      expect(res?.status).to.be.equals(Response.HTTP_CREATED)
      expect(res?.body).to.have.property('neightborhood', validData.neightborhood)
      expect(res?.body).to.have.property('city', validData.city)
      expect(res?.body).to.have.property('state', validData.state)
      expect(res?.body).to.have.property('postalCode', validData.postalCode)

      spy.restore()
    })
  })
})
