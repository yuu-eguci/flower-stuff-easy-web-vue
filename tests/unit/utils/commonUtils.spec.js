import { expect } from 'chai'
import commonUtils from '@/utils/commonUtils.js'

describe('tests/unit/utils/commonUtils.spec.js', () => {
  describe('commonUtils.add', () => {
    it('should add successfully', () => {
      const actual = commonUtils.add(1, 2)
      const expected = 3
      expect(actual).to.deep.equal(expected)
    })

    it('should fail', () => {
      const actual = commonUtils.add(1, 2)
      const expected = 2
      expect(actual).to.not.deep.equal(expected)
    })
  })
})
