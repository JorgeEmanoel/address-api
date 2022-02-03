import { expect } from 'chai'
import { Server } from 'http'
import supertest, { SuperAgentTest } from 'supertest'
import boostrap from '../../../app'
import invalidData, { IRegistrationData } from './dataProviders/invalidRegistrationData'
import Response from '../../../constants/http/response'
import sequelizeDb from '../../../databases/sequelizeDb'

let server: Server | null = null
let request: SuperAgentTest | null = null

function makeRequest (data: IRegistrationData = {}) {
  return request?.post('/auth/register')
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json')
    .send(data)
}

describe('Registration Test', function () {
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
    invalidData.forEach(function (data) {
      it(data.description, async function () {
        const res = await makeRequest(data.body)
        expect(res?.status).to.be.equals(Response.HTTP_BAD_REQUEST)
      })
    })
  })

  describe.only('Valid Data Input', function () {
    const validData: IRegistrationData = {
      name: 'John Doe',
      email: 'johndoe@domain.com',
      password: '123456',
      passwordConfirmation: '123456'
    }

    it('should not accept two accounts with the same email', async function () {
      const firstAccountResponse = await makeRequest(validData)
      expect(firstAccountResponse?.status).to.be.equals(Response.HTTP_CREATED)

      const secondAccountResponse = await makeRequest(validData)
      expect(secondAccountResponse?.status).to.be.equals(Response.HTTP_UNPROCESSABLE_ENTITY)
    })

    it.only('should return the user\'s data plus its id', async function () {
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
