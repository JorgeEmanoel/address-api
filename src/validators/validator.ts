import * as Rules from '../constants/validator/availableRules'
import MaxRule from './rules/max'
import MinRule from './rules/min'
import RequiredRule from './rules/required'
import EmailRule from './rules/email'

interface IFieldRule {
  fieldName: string
  rules: string[]
}

interface IData {
  [name: string]: string | number
}

interface IValidationErrors {
  field: string
  error: string
}

type ValidRule = MinRule | MaxRule | RequiredRule | EmailRule | null

class Validator {
  data: IData = {}
  fields: IFieldRule[]
  private _errors: IValidationErrors[] = []

  constructor (data: IData = {}, fields: IFieldRule[] = []) {
    this.data = data
    this.fields = fields
  }

  withData (data: IData) {
    this.data = data
    return this
  }

  withRules (fields: IFieldRule[]) {
    this.fields = fields
    return this
  }

  fails () {
    this._errors = []

    for (const field of this.fields) {
      if (
        !field.rules.includes(Rules.RULE_REQUIRED) &&
        !Object.keys(this.data).includes(field.fieldName)
      ) {
        continue
      }

      for (const rule of field.rules) {
        const [ruleName, referenceValue] = rule.split(':')
        const rulable = this._ruleInstanceByName(ruleName)

        if (!rulable) {
          throw new Error(`Invalid rule name: ${ruleName}`)
        }

        if (!rulable.withReference(referenceValue).isValid(this.data[field.fieldName])) {
          this._errors.push({
            field: field.fieldName,
            error: rulable.message(field.fieldName)
          })
        }
      }
    }

    return this._errors.length > 0
  }

  errors () {
    return [...this._errors]
  }

  _ruleInstanceByName (ruleName: string): ValidRule {
    switch (ruleName) {
    case Rules.RULE_MIN:
      return new MinRule()
    case Rules.RULE_MAX:
      return new MaxRule()
    case Rules.RULE_REQUIRED:
      return new RequiredRule()
    case Rules.RULE_EMAIL:
      return new EmailRule()
    }

    return null
  }
}

export default Validator
