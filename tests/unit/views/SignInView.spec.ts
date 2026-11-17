import { expect } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import SignInView from '@/views/SignInView.vue'
import Api from '@/axios'
import pnotifyUtils from '@/utils/pnotifyUtils'
import { FakeTimers, flushPromises } from '../helpers'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(BootstrapVueIcons)

// 実際の HTTP 通信、通知表示を行わないよう、Api と pnotifyUtils を差し替えます。
describe('tests/unit/views/SignInView.spec.ts', () => {
  const originalGet = Api.prototype.get
  const originalPost = Api.prototype.post
  const originalPopError = pnotifyUtils.popError
  const originalPopHidingError = pnotifyUtils.popHidingError
  const timers = new FakeTimers()
  let statusBody: unknown
  let verifyBody: unknown
  let posts: { url: string, data: unknown }[]
  let errors: string[]
  let routerPushes: unknown[]

  const mountView = async () => {
    const wrapper = shallowMount(SignInView, {
      localVue,
      mocks: { $router: { push: (location: unknown) => routerPushes.push(location) } }
    })
    await flushPromises()
    return wrapper
  }

  beforeEach(() => {
    statusBody = { ready: true }
    verifyBody = { verification_succeeded: false }
    posts = []
    errors = []
    routerPushes = []
    Api.prototype.get = async () => ({ statusCode: 200, body: statusBody, headers: {} })
    Api.prototype.post = async (url, data) => {
      posts.push({ url, data })
      return { statusCode: 200, body: verifyBody, headers: {} }
    }
    pnotifyUtils.popError = (mes: string) => { errors.push(mes) }
    pnotifyUtils.popHidingError = (mes: string) => { errors.push(mes) }
    timers.install()
  })

  afterEach(() => {
    timers.uninstall()
    Api.prototype.get = originalGet
    Api.prototype.post = originalPost
    pnotifyUtils.popError = originalPopError
    pnotifyUtils.popHidingError = originalPopHidingError
  })

  it('should hide the overlay when the server is ready', async () => {
    const wrapper = await mountView()
    expect(wrapper.vm.$data.showJumbotronOverlay).to.equal(false)
    expect(errors).to.deep.equal([])
  })

  it('should show an error when the server is not ready', async () => {
    statusBody = { ready: false }
    const wrapper = await mountView()
    expect(wrapper.vm.$data.showJumbotronOverlay).to.equal(true)
    expect(errors).to.deep.equal(['Sorry, the server is not ready.'])
  })

  it('should not verify until 4 digits are entered', async () => {
    const wrapper = await mountView()
    await wrapper.setData({ pincode: '123' })
    await flushPromises()
    expect(posts).to.deep.equal([])
  })

  it('should show an error for an invalid pincode', async () => {
    const wrapper = await mountView()
    await wrapper.setData({ pincode: '1234' })
    await flushPromises()
    expect(posts).to.deep.equal([{ url: '/api/v1/verify-pincode', data: { pincode: '1234' } }])
    expect(errors).to.deep.equal(['Invalid pincode.'])
    expect(wrapper.vm.$data.locked).to.equal(true)
  })

  it('should show the server message when verification fails with an error', async () => {
    verifyBody = { message: 'Server error.' }
    const wrapper = await mountView()
    await wrapper.setData({ pincode: '1234' })
    await flushPromises()
    expect(errors).to.deep.equal(['Server error.'])
    expect(wrapper.vm.$data.locked).to.equal(true)
  })

  it('should unlock and go to MediaView for a valid pincode', async () => {
    verifyBody = { verification_succeeded: true }
    const wrapper = await mountView()
    await wrapper.setData({ pincode: '1234' })
    await flushPromises()
    expect(errors).to.deep.equal([])
    expect(wrapper.vm.$data.showJumbotronOverlay).to.equal(true)
    expect(wrapper.vm.$data.iconAnimation).to.equal('cylon')

    expect(timers.runNext()).to.equal(1500)
    expect(wrapper.vm.$data.showJumbotronOverlay).to.equal(false)
    expect(wrapper.vm.$data.locked).to.equal(false)
    expect(routerPushes).to.deep.equal([])

    expect(timers.runNext()).to.equal(1500)
    expect(routerPushes).to.deep.equal([{ path: '/media' }])
  })
})
