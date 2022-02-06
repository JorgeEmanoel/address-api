import { expect, should } from 'chai'
import MinRule from '../../../validators/rules/min'
import MaxRule from '../../../validators/rules/max'
import RequiredRule from '../../../validators/rules/required'
import EmailRule from '../../../validators/rules/email'
import Validator from '../../../validators/validator'
import sinon, { SinonSandbox } from 'sinon'
should()

describe('Components => vaidators/Validator', function () {
  let sandbox: SinonSandbox

  beforeEach(function () {
    sandbox = sinon.createSandbox()
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('Single rule', function () {
    it('Should work with Required Rule', function () {
      const data = {
        value: ''
      }

      const spy = sandbox.stub(RequiredRule.prototype, 'isValid').returns(false)

      const validator = new Validator(data, [
        {
          fieldName: 'value',
          rules: ['required']
        }
      ])
      const fails = validator.fails()
      const errors = validator.errors()

      expect(spy.withArgs(data.value).calledOnce).to.be.equals(true)
      expect(fails).to.be.equals(true)
      expect(errors.length).to.be.equals(1)
      expect(errors[0]).to.have.property('field', 'value')
      expect(errors[0]).to.have.property('error', 'The field value is required')
    })

    it('Should work with Email Rule', function () {
      const data = { value: '' }
      const spy = sandbox.stub(EmailRule.prototype, 'isValid').returns(false)
      const validator = new Validator(data, [
        {
          fieldName: 'value',
          rules: ['email']
        }
      ])
      const fails = validator.fails()
      const errors = validator.errors()

      expect(spy.withArgs(data.value).calledOnce).to.be.equals(true)
      expect(fails).to.be.equals(true)
      expect(errors.length).to.be.equals(1)
      expect(errors[0]).to.have.property('field', 'value')
      expect(errors[0]).to.have.property('error', 'The field value must be a valid email address')
    })

    it('Should work with Min Rule', function () {
      const data = { value: '' }
      const MIN = 10

      const isValidSpy = sandbox.stub(MinRule.prototype, 'isValid').returns(false)
      const withValueSpy = sandbox.spy(MinRule.prototype, 'withValue')

      const validator = new Validator(data, [
        {
          fieldName: 'value',
          rules: [`min:${MIN}`]
        }
      ])

      const fails = validator.fails()
      const errors = validator.errors()

      expect(isValidSpy.withArgs(data.value).calledOnce).to.be.equals(true)
      expect(withValueSpy.withArgs(String(MIN)).calledOnce).to.be.equals(true)
      expect(fails).to.be.equals(true)
      expect(errors.length).to.be.equals(1)
      expect(errors[0]).to.have.property('field', 'value')
      expect(errors[0]).to.have.property('error', `The field value must have at least ${MIN} chars`)
    })

    it('Should work with Max Rule', function () {
      const data = { value: '' }
      const MAX = 10

      const isValidSpy = sandbox.stub(MaxRule.prototype, 'isValid').returns(false)
      const withValueSpy = sandbox.spy(MaxRule.prototype, 'withValue')

      const validator = new Validator(data, [
        {
          fieldName: 'value',
          rules: [`max:${MAX}`]
        }
      ]
      )
      const fails = validator.fails()
      const errors = validator.errors()

      expect(isValidSpy.withArgs(data.value).calledOnce).to.be.equals(true)
      expect(withValueSpy.withArgs(String(MAX)).calledOnce).to.be.equals(true)
      expect(fails).to.be.equals(true)
      expect(errors.length).to.be.equals(1)
      expect(errors[0]).to.have.property('field', 'value')
      expect(errors[0]).to.have.property('error', `The field value must have up to ${MAX} chars`)
    })
  })

  describe('Combined rules', function () {
    interface MakeSpiesProps {
      minRuleIsValid?: boolean
      maxRuleIsValid?: boolean
      requiredIsValid?: boolean
      emailIsValid?: boolean
    }
    const makeSpies = ({
      minRuleIsValid = false,
      maxRuleIsValid = false,
      requiredIsValid = false,
      emailIsValid = false
    }: MakeSpiesProps = {}) => ({
      minRule: {
        isValid: sandbox.stub(MinRule.prototype, 'isValid').returns(minRuleIsValid),
        withValue: sandbox.spy(MinRule.prototype, 'withValue')
      },
      maxRule: {
        isValid: sandbox.stub(MaxRule.prototype, 'isValid').returns(maxRuleIsValid),
        withValue: sandbox.spy(MaxRule.prototype, 'withValue')
      },
      required: {
        isValid: sandbox.stub(RequiredRule.prototype, 'isValid').returns(requiredIsValid)
      },
      email: {
        isValid: sandbox.stub(EmailRule.prototype, 'isValid').returns(emailIsValid)
      }
    })

    it('Should be able to combine all the rules and return all the errors', function () {
      const data = { value: 'some-awesome-real-value' }
      const MAX = 10
      const MIN = 5

      const validator = new Validator(data, [
        {
          fieldName: 'value',
          rules: [`max:${MAX}`, `min:${MIN}`, 'required', 'email']
        }
      ])

      const spies = makeSpies()

      const fails = validator.fails()
      const errors = validator.errors()

      expect(fails).to.be.equals(true)

      errors.should.have.property('length', 4)
      spies.maxRule.isValid.withArgs(data.value).should.have.property('calledOnce', true)
      spies.maxRule.withValue.withArgs(String(MAX)).should.have.property('calledOnce', true)

      spies.minRule.isValid.withArgs(data.value).should.have.property('calledOnce', true)
      spies.minRule.withValue.withArgs(String(MIN)).should.have.property('calledOnce', true)

      spies.required.isValid.withArgs(data.value).should.have.property('calledOnce', true)
      spies.email.isValid.withArgs(data.value).should.have.property('calledOnce', true)

      expect(errors[0]).to.have.property('field', 'value')
      expect(errors[0]).to.have.property('error', `The field value must have up to ${MAX} chars`)

      expect(errors[1]).to.have.property('field', 'value')
      expect(errors[1]).to.have.property('error', `The field value must have at least ${MIN} chars`)

      expect(errors[2]).to.have.property('field', 'value')
      expect(errors[2]).to.have.property('error', 'The field value is required')

      expect(errors[3]).to.have.property('field', 'value')
      expect(errors[3]).to.have.property('error', 'The field value must be a valid email address')
    })

    it('Should NOT FAIL if all the rules return valid', function () {
      const data = { value: 'some-awesome-real-value' }
      const MAX = 10
      const MIN = 5

      const validator = new Validator(data, [
        {
          fieldName: 'value',
          rules: [`max:${MAX}`, `min:${MIN}`, 'required', 'email']
        }
      ])

      makeSpies({
        emailIsValid: true,
        maxRuleIsValid: true,
        minRuleIsValid: true,
        requiredIsValid: true
      })

      const fails = validator.fails()
      const errors = validator.errors()

      expect(fails).to.be.equals(false)
      errors.should.have.property('length', 0)
    })

    it('Should FAIL if at least one rule return NOT VALID', function () {
      const data = { value: 'some-awesome-real-value' }
      const MAX = 10
      const MIN = 5

      const validator = new Validator(data, [
        {
          fieldName: 'value',
          rules: [`max:${MAX}`, `min:${MIN}`, 'required', 'email']
        }
      ])

      makeSpies({
        emailIsValid: false,
        maxRuleIsValid: true,
        minRuleIsValid: true,
        requiredIsValid: true
      })

      const fails = validator.fails()
      const errors = validator.errors()

      expect(fails).to.be.equals(true)
      errors.should.have.property('length', 1)
    })
  })
})
