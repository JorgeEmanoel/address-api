import { expect } from 'chai'
import { Server } from 'http'
import sinon, { SinonSandbox } from 'sinon'
import supertest, { SuperAgentTest } from 'supertest'
import jwt from 'jsonwebtoken'
import boostrap from '../../../app'
import invalidData, { IUpdateData } from './dataProviders/invalidUpdateData'
import Response from '../../../constants/http/response'
import UserRepository from '../../../repositories/userRepository'
import UserDTO from '../../../dto/userDto'
import Hasher from '../../../security/hasher'
import { auth as AuthConfig } from '../../../config'
import AddressRepository from '../../../repositories/addressRepository'

let server: Server | null = null
let request: SuperAgentTest | null = null

const validData = {
  id: 2022,
  name: 'John Doe',
  email: 'johndoe@domain.com',
  password: '12345678'
}

const userToken = jwt.sign({
  id: validData.id
}, AuthConfig.jwt.secret, {
  expiresIn: AuthConfig.jwt.timeout
})

const hasher = new Hasher()

function deleteData () {
  return request?.delete('/auth/data')
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', userToken)
}

function getData () {
  return request?.get('/auth/data')
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', userToken)
}

function update (data: IUpdateData = {}) {
  return request?.put('/auth/data')
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', userToken)
    .send(data)
}

describe('Show Test', function () {
  let showSandbox: SinonSandbox

  before(async function () {
    const { app } = await boostrap([])

    server = app.listen()
    request = supertest.agent(server)
  })

  after(function () {
    server?.close()
  })

  beforeEach(() => {
    showSandbox = sinon.createSandbox()
    showSandbox.stub(UserRepository.prototype, 'count').resolves(0)
    showSandbox.stub(UserRepository.prototype, 'find').resolves({
      user: new UserDTO(
        validData.name,
        validData.email,
        validData.id
      ),
      password: hasher.make(validData.password)
    })
    showSandbox.stub(AddressRepository.prototype, 'all').resolves([])
  })

  afterEach(function () {
    showSandbox.restore()
  })

  it('Should return the user\'s data and its addresses', async function () {
    const res = await getData()

    expect(res?.status).to.be.equals(Response.HTTP_OK)
    expect(res?.body).have.property('user').have.property('name', validData.name)
    expect(res?.body).have.property('user').have.property('email', validData.email)
    expect(res?.body).have.property('user').have.property('id', validData.id)
    expect(res?.body).have.property('addresses')
  })
})

describe('Update Test', function () {
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
      invalidSandbox.stub(UserRepository.prototype, 'find').resolves({
        user: new UserDTO(
          validData.name,
          validData.email,
          validData.id
        ),
        password: hasher.make(validData.password)
      })
    })

    afterEach(function () {
      invalidSandbox.restore()
    })

    invalidData.forEach(function (data) {
      it(data.description, async function () {
        const res = await update(data.body)
        expect(res?.status).to.be.equals(Response.HTTP_BAD_REQUEST)
        expect(res?.body).to.have.property('errors')
      })
    })
  })

  describe('Valid Data Input', function () {
    let sandbox: SinonSandbox

    beforeEach(() => {
      sandbox = sinon.createSandbox()
      sandbox.stub(UserRepository.prototype, 'find').resolves({
        user: new UserDTO(
          validData.name,
          validData.email,
          validData.id
        ),
        password: hasher.make(validData.password)
      })
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('Should update the user data', async function () {
      const data = {
        name: 'Only John',
        email: 'onlyjohn@domain.com'
      }

      sandbox.stub(UserRepository.prototype, 'count').resolves(0)

      const spy = sandbox.stub(UserRepository.prototype, 'update').resolves(
        new UserDTO(data.name, data.email, validData.id)
      )

      const res = await update(data)

      expect(res?.status).to.be.equals(Response.HTTP_OK)
      expect(res?.body).to.have.property('name', data.name)
      expect(res?.body).to.have.property('email', data.email)
      expect(res?.body).to.have.property('id', validData.id)
      expect(spy.withArgs(validData.id, data).calledOnce).to.be.equals(true)
    })
  })
})

describe('Delete Test', function () {
  let deleteSandbox: SinonSandbox

  before(async function () {
    const { app } = await boostrap([])

    server = app.listen()
    request = supertest.agent(server)
  })

  after(function () {
    server?.close()
  })

  beforeEach(() => {
    deleteSandbox = sinon.createSandbox()
    deleteSandbox.stub(UserRepository.prototype, 'find').resolves({
      user: new UserDTO(
        validData.name,
        validData.email,
        validData.id
      ),
      password: hasher.make(validData.password)
    })
    deleteSandbox.stub(AddressRepository.prototype, 'all').resolves([])
  })

  afterEach(function () {
    deleteSandbox.restore()
  })

  it('Should return the user\'s data after its deletion', async function () {
    const spy = deleteSandbox.stub(UserRepository.prototype, 'delete').resolves(new UserDTO(
      validData.name,
      validData.email,
      validData.id
    ))

    const res = await deleteData()

    expect(spy.withArgs(validData.id).calledOnce).to.be.equals(true)
    expect(res?.status).to.be.equals(Response.HTTP_OK)
    expect(res?.body).have.property('name', validData.name)
    expect(res?.body).have.property('email', validData.email)
    expect(res?.body).have.property('id', validData.id)
  })
})
