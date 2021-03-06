import { expect } from 'chai'
import RequiredRule from '../../../validators/rules/required'

describe('Components => rules/RequiredRule', function () {
  it('Should not accept undefined values', function () {
    const rule = new RequiredRule()
    expect(rule.withReference().isValid(undefined)).to.be.equals(false)
  })

  it('Should not accept null values', function () {
    const rule = new RequiredRule()
    expect(rule.withReference().isValid(null)).to.be.equals(false)
  })

  it('Should not accept empty strings', function () {
    const rule = new RequiredRule()
    expect(rule.withReference().isValid('')).to.be.equals(false)
  })
})
