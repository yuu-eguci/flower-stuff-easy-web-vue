import { expect } from 'chai'
import Api from '@/axios'
import { getStatus, verifyPincode, predictImage } from '@/api'

// 実際の HTTP 通信を行わないよう、Api の get/post を差し替えます。
describe('tests/unit/api/index.spec.ts', () => {
  const originalGet = Api.prototype.get
  const originalPost = Api.prototype.post
  let calls: { method: string, url: string, payload: unknown }[]

  beforeEach(() => {
    calls = []
    Api.prototype.get = async function (url, params) {
      calls.push({ method: 'get', url, payload: params })
      return { statusCode: 200, body: { ready: true }, headers: {} }
    }
    Api.prototype.post = async function (url, data) {
      calls.push({ method: 'post', url, payload: data })
      return { statusCode: 200, body: { echo: data }, headers: {} }
    }
  })

  afterEach(() => {
    Api.prototype.get = originalGet
    Api.prototype.post = originalPost
  })

  it('getStatus should GET /api/v1/status and return the body', async () => {
    const actual = await getStatus()
    expect(calls).to.deep.equal([{ method: 'get', url: '/api/v1/status', payload: undefined }])
    expect(actual).to.deep.equal({ ready: true })
  })

  it('verifyPincode should POST the pincode and return the body', async () => {
    const actual = await verifyPincode('1234')
    expect(calls).to.deep.equal([{ method: 'post', url: '/api/v1/verify-pincode', payload: { pincode: '1234' } }])
    expect(actual).to.deep.equal({ echo: { pincode: '1234' } })
  })

  it('predictImage should POST the base64 image and return the body', async () => {
    const actual = await predictImage('data:image/png;base64,AAAA')
    expect(calls).to.deep.equal([{
      method: 'post',
      url: '/api/v1/predict-image',
      payload: { base64image: 'data:image/png;base64,AAAA' }
    }])
    expect(actual).to.deep.equal({ echo: { base64image: 'data:image/png;base64,AAAA' } })
  })
})
