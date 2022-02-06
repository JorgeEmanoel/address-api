import { expect } from 'chai'
import { Server } from 'http'
import sinon, { SinonSandbox } from 'sinon'
import supertest, { SuperAgentTest } from 'supertest'
import boostrap from '../../../app'
import invalidData, { IRegistrationData } from './dataProviders/invalidRegistrationData'
import Response from '../../../constants/http/response'
import UserRepository from '../../../repositories/userRepository'
import UserDTO from '../../../dto/userDto'

let server: Server | null = null
let request: SuperAgentTest | null = null

function makeRequest (data: IRegistrationData = {}) {
  return request?.post('/auth/register')
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json')
    .send(data)
}

describe('UserController => store', function () {
  before(async function () {
    const { app } = await boostrap([])

    server = app.listen()
    request = supertest.agent(server)
  })

  after(function () {
    server?.close()
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
  })

  describe('Valid Data Input', function () {
    const validData = {
      name: 'John Doe',
      email: 'johndoe@domain.com',
      password: '12345678',
      passwordConfirmation: '12345678'
    }

    let sandbox: SinonSandbox

    beforeEach(() => {
      sandbox = sinon.createSandbox()
      sandbox.stub(UserRepository.prototype, 'store').resolves(new UserDTO(
        validData.name,
        validData.email,
        1
      ))
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('should not accept two accounts with the same email', async function () {
      sandbox.stub(UserRepository.prototype, 'count').resolves(0)

      const firstAccountResponse = await makeRequest(validData)
      expect(firstAccountResponse?.status).to.be.equals(Response.HTTP_CREATED)

      sandbox.restore()
      sandbox.stub(UserRepository.prototype, 'count').resolves(1)

      const secondAccountResponse = await makeRequest(validData)
      expect(secondAccountResponse?.status).to.be.equals(Response.HTTP_UNPROCESSABLE_ENTITY)
    })

    it('should return the user\'s data plus its id', async function () {
      sandbox.stub(UserRepository.prototype, 'count').resolves(0)

      const res = await makeRequest(validData)

      expect(res?.status).to.be.equals(Response.HTTP_CREATED)
      expect(res?.body).to.have.property('id')
      expect(res?.body).to.have.property('name')
      expect(res?.body).to.have.property('email')
      expect(res?.body).not.to.have.property('password')
      expect(res?.body).not.to.have.property('passwordConfirmation')
    })
  })
})
