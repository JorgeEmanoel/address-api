import { expect } from 'chai'
import EmailRule from '../../../validators/rules/email'

describe('Components => rules/EmailRule', function () {
  it('Should not accept value without @', function () {
    const rule = new EmailRule()
    expect(rule.withReference().isValid('fakeemaildomain.com')).to.be.equals(false)
  })

  it('Should not accept value without DOMAIN', function () {
    const rule = new EmailRule()
    expect(rule.withReference().isValid('fakeemail@domain')).to.be.equals(false)
  })

  it('Should not accept generic malformatted value', function () {
    const rule = new EmailRule()
    expect(rule.withReference().isValid('fakeemaildomain')).to.be.equals(false)
    expect(rule.withReference().isValid('fakeemail@')).to.be.equals(false)
    expect(rule.withReference().isValid('@')).to.be.equals(false)
    expect(rule.withReference().isValid('domain.')).to.be.equals(false)
    expect(rule.withReference().isValid('domain.com')).to.be.equals(false)
    expect(rule.withReference().isValid('.com')).to.be.equals(false)
    expect(rule.withReference().isValid('.')).to.be.equals(false)
    expect(rule.withReference().isValid('')).to.be.equals(false)
  })
})
