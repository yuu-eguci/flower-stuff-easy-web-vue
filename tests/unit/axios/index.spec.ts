import { expect } from 'chai'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import Api from '@/axios'

// 実際の HTTP 通信を行わないよう、axios の adapter を差し替えます。
const useFakeAdapter = function (
  api: Api,
  respond: (config: AxiosRequestConfig) => Promise<AxiosResponse<unknown>>
): AxiosRequestConfig[] {
  const requests: AxiosRequestConfig[] = []
  api.instance.defaults.adapter = (config) => {
    requests.push(config)
    return respond(config)
  }
  return requests
}

const fakeResponse = function (config: AxiosRequestConfig, status: number, data: unknown): AxiosResponse<unknown> {
  return { data, status, statusText: '', headers: { 'x-test': 'yes' }, config }
}

describe('tests/unit/axios/index.spec.ts', () => {
  describe('Api', () => {
    it('should create an axios instance with the base URL and headers', () => {
      const api = new Api('http://api.test.invalid', { 'Content-Type': 'application/json' })
      expect(api.instance.defaults.baseURL).to.equal('http://api.test.invalid')
      expect(api.instance.defaults.headers?.['Content-Type']).to.equal('application/json')
    })

    it('should send GET with query params and return the processed response', async () => {
      const api = new Api('http://api.test.invalid', {})
      const requests = useFakeAdapter(api, async (config) => fakeResponse(config, 200, { ready: true }))

      const res = await api.get('/api/v1/status', { q: 'x' })

      expect(requests).to.have.length(1)
      expect(requests[0].method).to.equal('get')
      expect(requests[0].url).to.equal('/api/v1/status')
      expect(requests[0].params).to.deep.equal({ q: 'x' })
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.deep.equal({ ready: true })
      expect(res.headers).to.deep.equal({ 'x-test': 'yes' })
    })

    it('should send POST with JSON body and return the processed response', async () => {
      const api = new Api('http://api.test.invalid', { 'Content-Type': 'application/json' })
      const requests = useFakeAdapter(api, async (config) => fakeResponse(config, 200, { ok: 1 }))

      const res = await api.post('/api/v1/verify-pincode', { pincode: '1234' })

      expect(requests).to.have.length(1)
      expect(requests[0].method).to.equal('post')
      expect(requests[0].url).to.equal('/api/v1/verify-pincode')
      expect(JSON.parse(requests[0].data)).to.deep.equal({ pincode: '1234' })
      expect(res.body).to.deep.equal({ ok: 1 })
    })

    it('should return the error response body on HTTP error', async () => {
      const api = new Api('http://api.test.invalid', {})
      useFakeAdapter(api, (config) => Promise.reject(
        Object.assign(new Error('Request failed with status code 400'), {
          response: fakeResponse(config, 400, { message: 'bad request' })
        })
      ))

      const getRes = await api.get('/api/v1/status')
      expect(getRes.statusCode).to.equal(400)
      expect(getRes.body).to.deep.equal({ message: 'bad request' })

      const postRes = await api.post('/api/v1/predict-image', {})
      expect(postRes.statusCode).to.equal(400)
      expect(postRes.body).to.deep.equal({ message: 'bad request' })
    })
  })
})
