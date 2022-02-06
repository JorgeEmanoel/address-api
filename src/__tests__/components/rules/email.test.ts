import { expect } from 'chai'
import EmailRule from '../../../validators/rules/email'

describe('Components => rules/EmailRule', function () {
  it('Should not accept value without @', function () {
    const rule = new EmailRule()
    expect(rule.withValue().isValid('fakeemaildomain.com')).to.be.equals(false)
  })

  it('Should not accept value without DOMAIN', function () {
    const rule = new EmailRule()
    expect(rule.withValue().isValid('fakeemail@domain')).to.be.equals(false)
  })

  it('Should not accept generic malformatted value', function () {
    const rule = new EmailRule()
    expect(rule.withValue().isValid('fakeemaildomain')).to.be.equals(false)
    expect(rule.withValue().isValid('fakeemail@')).to.be.equals(false)
    expect(rule.withValue().isValid('@')).to.be.equals(false)
    expect(rule.withValue().isValid('domain.')).to.be.equals(false)
    expect(rule.withValue().isValid('domain.com')).to.be.equals(false)
    expect(rule.withValue().isValid('.com')).to.be.equals(false)
    expect(rule.withValue().isValid('.')).to.be.equals(false)
    expect(rule.withValue().isValid('')).to.be.equals(false)
  })
})
