import { expect } from 'chai'
import supertest from 'supertest'
import app from '../../../app'
import invalidData, { IRegistrationData } from './dataProviders/invalidRegistrationData'
import Response from '../../../constants/http/response'

const server = app.listen()
const request = supertest.agent(server)

describe('Registration Test', function () {
  function makeRequest (data: IRegistrationData = {}) {
    return request.post('users').send(data)
  }

  after(function () {
    server.close()
  })

  describe('Invalid Data Validation', function () {
    invalidData.forEach(function (data) {
      it(data.description, async function () {
        const res = await makeRequest(data.body)
        expect(res.status).to.be.equals(Response.HTTP_BAD_REQUEST)
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
      expect(firstAccountResponse.status).to.be.equals(Response.HTTP_CREATED)

      const secondAccountResponse = await makeRequest(validData)
      expect(secondAccountResponse.status).to.be.equals(Response.HTTP_UNPROCESSABLE_ENTITY)
    })

    it('should return the user\'s data plus its id', async function () {
      const res = await makeRequest(validData)
      expect(res.status).to.be.equals(Response.HTTP_CREATED)
      expect(res.body).to.have.property('id')
      expect(res.body).to.have.property('name')
      expect(res.body).to.have.property('email')
      expect(res.body).not.to.have.property('password')
      expect(res.body).not.to.have.property('passwordConfirmation')
    })
  })
})
