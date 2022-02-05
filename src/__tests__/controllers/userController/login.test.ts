import { expect } from 'chai'
import { Server } from 'http'
import sinon, { SinonSandbox } from 'sinon'
import supertest, { SuperAgentTest } from 'supertest'
import boostrap from '../../../app'
import invalidData, { ILoginData } from './dataProviders/invalidLoginData'
import Response from '../../../constants/http/response'
import sequelizeDb from '../../../databases/sequelizeDb'
import UserRepository from '../../../repositories/userRepository'
import UserDTO from '../../../dto/userDto'
import Hasher from '../../../security/hasher'
import jwt from 'jsonwebtoken'
import { auth as AuthConfig } from '../../../config'

let server: Server | null = null
let request: SuperAgentTest | null = null
const hasher = new Hasher()

const validData = {
  id: 2022,
  email: 'johndoe@domain.com',
  password: '12345678'
}

function makeRequest (data: ILoginData = {}) {
  return request?.post('/auth/login')
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json')
    .send(data)
}

describe('Login Test', function () {
  before(async function () {
    const { app } = await boostrap([sequelizeDb])

    server = app.listen()
    request = supertest.agent(server)
  })

  after(function () {
    server?.close()
    sequelizeDb.disconnect()
  })

  describe('Invalid Data Validation', function () {
    let invalidSandbox: SinonSandbox

    beforeEach(() => {
      invalidSandbox = sinon.createSandbox()
      invalidSandbox.stub(UserRepository.prototype, 'count').resolves(0)
    })

    afterEach(function () {
      invalidSandbox.restore()
    })

    invalidData.forEach(function (data) {
      it(data.description, async function () {
        const res = await makeRequest(data.body)
        expect(res?.status).to.be.equals(Response.HTTP_BAD_REQUEST)
        expect(res?.body).to.have.property('errors')
      })
    })

    it('Should not proceed if no user is found', async function () {
      invalidSandbox.stub(UserRepository.prototype, 'find').resolves(null)
      const res = await makeRequest(validData)

      expect(res?.status).to.be.equals(Response.HTTP_FORBIDDEN)
      expect(res?.body).to.have.property('message')
      expect(res?.body.message).to.be.equals('Invalid e-mail or password')
    })

    it('Should not proceed if the given password is not valid', async function () {
      invalidSandbox.stub(UserRepository.prototype, 'find').resolves({
        user: new UserDTO('John Doe', validData.email, validData.id),
        password: hasher.make(`invalid-${validData.password}`)
      })

      const res = await makeRequest(validData)

      expect(res?.status).to.be.equals(Response.HTTP_FORBIDDEN)
      expect(res?.body).to.have.property('message')
      expect(res?.body.message).to.be.equals('Invalid e-mail or password')
    })
  })

  describe('Valid Data Input', function () {
    let sandbox: SinonSandbox

    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('Should return a valid JWT when the given data is right', async function () {
      sandbox.stub(UserRepository.prototype, 'find').resolves({
        user: new UserDTO('John Doe', validData.email, validData.id),
        password: hasher.make(validData.password)
      })

      const res = await makeRequest(validData)

      expect(res?.status).to.be.equals(Response.HTTP_OK)
      expect(res?.body).to.have.property('token')

      let payload: unknown

      expect(() => {
        payload = jwt.verify(res?.body.token, AuthConfig.jwt.secret)
      }).not.throws()
      expect((<{ id: number }>payload).id).to.be.equals(validData.id)
    })
  })
})
