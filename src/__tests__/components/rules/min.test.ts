import { expect } from 'chai'
import MinRule from '../../../validators/rules/min'

describe('Components => rules/MinRule', function () {
  it('Should be useful with NUMBERS, by validating its VALUE', function () {
    const rule = new MinRule()

    // 2 is the minimum value, so 3 should pass
    expect(rule.withReference(2).isValid(3)).to.be.equals(true)
    // 2 is the minimum value, so 2 should pass
    expect(rule.withReference(2).isValid(2)).to.be.equals(true)
    // 2 is the minimum value, so 1 should not pass
    expect(rule.withReference(2).isValid(1)).to.be.equals(false)
  })

  it('Should be useful with STRINGS, by validating its LENGTH', function () {
    const rule = new MinRule()

    // 2 is the minimum value, so the string with 11 chars should pass
    expect(rule.withReference(10).isValid('#'.repeat(11))).to.be.equals(true)
    // 10 is the minimum value, so the string with 10 chars should pass
    expect(rule.withReference(10).isValid('#'.repeat(10))).to.be.equals(true)
    // 10 is the minimum value, so the string with 9 chars should not pass
    expect(rule.withReference(10).isValid('#'.repeat(9))).to.be.equals(false)
  })
})
