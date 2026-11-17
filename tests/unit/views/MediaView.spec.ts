import { expect } from 'chai'
import Vue from 'vue'
import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import MediaView from '@/views/MediaView.vue'
import Api from '@/axios'
import pnotifyUtils from '@/utils/pnotifyUtils'
import { FakeTimers, flushPromises } from '../helpers'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(BootstrapVueIcons)

const IMAGE = 'data:image/png;base64,AAAA'

// template から呼ばれる methods を直接実行するための型付けです。
type MediaViewMethods = {
  onClickPredictButton: () => Promise<void>
  onClickBackButton: () => Promise<void>
  onClickSignOutButton: () => void
}
const methodsOf = (wrapper: Wrapper<Vue>) => wrapper.vm as unknown as MediaViewMethods

// 実際のカメラ、HTTP 通信、通知表示を使わないよう、各 API を差し替えます。
describe('tests/unit/views/MediaView.spec.ts', () => {
  const originalPost = Api.prototype.post
  const originalPopHidingError = pnotifyUtils.popHidingError
  const originalGetContext = HTMLCanvasElement.prototype.getContext
  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL
  const originalConsoleInfo = console.info
  const timers = new FakeTimers()
  let predictBody: unknown
  let posts: { url: string, data: unknown }[]
  let errors: string[]
  let routerPushes: unknown[]
  let stoppedTracks: number

  const fakeStream = () => ({
    getTracks: () => [{ stop: () => { stoppedTracks += 1 } }]
  })

  const installCamera = function () {
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getSupportedConstraints: () => ({ aspectRatio: true, width: true, height: true, facingMode: true }),
        getUserMedia: async () => fakeStream()
      }
    })
  }

  const mountView = async () => {
    const wrapper = shallowMount(MediaView, {
      localVue,
      mocks: { $router: { push: (location: unknown) => routerPushes.push(location) } }
    })
    await flushPromises()
    return wrapper
  }

  beforeEach(() => {
    predictBody = { result: [{ id: 1, name: 'rose', confidence: 0.9 }], hdf5_version: '3' }
    posts = []
    errors = []
    routerPushes = []
    stoppedTracks = 0
    Api.prototype.post = async (url, data) => {
      posts.push({ url, data })
      return { statusCode: 200, body: predictBody, headers: {} }
    }
    pnotifyUtils.popHidingError = (mes: string) => { errors.push(mes) }
    HTMLCanvasElement.prototype.getContext = (() => ({ drawImage: () => undefined })) as never
    HTMLCanvasElement.prototype.toDataURL = () => IMAGE
    // カメラ起動失敗時に component が出力するログを抑制します。
    console.info = () => undefined
    timers.install()
  })

  afterEach(() => {
    timers.uninstall()
    delete (navigator as { mediaDevices?: unknown }).mediaDevices
    Api.prototype.post = originalPost
    pnotifyUtils.popHidingError = originalPopHidingError
    HTMLCanvasElement.prototype.getContext = originalGetContext
    HTMLCanvasElement.prototype.toDataURL = originalToDataURL
    console.info = originalConsoleInfo
  })

  it('should show the camera unavailable message when the camera cannot start', async () => {
    const wrapper = await mountView()
    expect(wrapper.vm.$data.cameraStream).to.equal(null)

    expect(timers.runNext()).to.equal(1000)
    expect(wrapper.vm.$data.showCameraIsUnavailableMessage).to.equal(true)
    expect(wrapper.vm.$data.showCameraIsStartingMessage).to.equal(false)
  })

  it('should open the camera area when the camera starts', async () => {
    installCamera()
    const wrapper = await mountView()
    expect(wrapper.vm.$data.cameraStream).to.not.equal(null)
    expect(wrapper.vm.$data.showCollapseCamera).to.equal(false)

    expect(timers.runNext()).to.equal(5000)
    expect(wrapper.vm.$data.showCameraIsStartingMessage).to.equal(false)
    expect(wrapper.vm.$data.showCollapseCamera).to.equal(true)
  })

  it('should send the frame and show the prediction result', async () => {
    installCamera()
    const wrapper = await mountView()
    timers.runNext()

    await methodsOf(wrapper).onClickPredictButton()
    expect(posts).to.deep.equal([{ url: '/api/v1/predict-image', data: { base64image: IMAGE } }])
    expect(wrapper.vm.$data.imgSrcBase64).to.equal(IMAGE)
    expect(wrapper.vm.$data.predictionResults).to.deep.equal([{ id: 1, name: 'rose', confidence: 0.9 }])
    expect(wrapper.vm.$data.predictionVersion).to.equal('3')
    expect(wrapper.vm.$data.showCollapseCameraOverlay).to.equal(true)

    expect(timers.runNext()).to.equal(5000)
    expect(stoppedTracks).to.equal(1)
    expect(wrapper.vm.$data.cameraStream).to.equal(null)
    expect(wrapper.vm.$data.showCollapseCameraOverlay).to.equal(false)
    expect(wrapper.vm.$data.showCollapseCamera).to.equal(false)

    expect(timers.runNext()).to.equal(500)
    expect(wrapper.vm.$data.showCollapsePredictionResult).to.equal(true)
  })

  it('should show the server message when prediction fails', async () => {
    predictBody = { message: 'Prediction failed.' }
    installCamera()
    const wrapper = await mountView()
    timers.runNext()

    await methodsOf(wrapper).onClickPredictButton()
    expect(errors).to.deep.equal(['Prediction failed.'])
    expect(wrapper.vm.$data.showCollapseCameraOverlay).to.equal(false)
    expect(wrapper.vm.$data.showCollapseCamera).to.equal(true)
    expect(timers.pending).to.equal(0)
  })

  it('should reset the result and restart the camera on back', async () => {
    installCamera()
    const wrapper = await mountView()
    timers.runNext()
    await wrapper.setData({ showCollapsePredictionResult: true, imgSrcBase64: IMAGE, predictionVersion: '3', cameraStream: null })

    await methodsOf(wrapper).onClickBackButton()
    expect(wrapper.vm.$data.showCameraIsStartingMessage).to.equal(true)
    expect(wrapper.vm.$data.showCollapsePredictionResult).to.equal(false)
    expect(wrapper.vm.$data.imgSrcBase64).to.equal('')
    expect(wrapper.vm.$data.predictionResults).to.deep.equal([])
    expect(wrapper.vm.$data.predictionVersion).to.equal('')
    expect(wrapper.vm.$data.cameraStream).to.not.equal(null)

    expect(timers.runNext()).to.equal(3000)
    expect(wrapper.vm.$data.showCameraIsStartingMessage).to.equal(false)
    expect(wrapper.vm.$data.showCollapseCamera).to.equal(true)
  })

  it('should go back to SignInView on sign out', async () => {
    const wrapper = await mountView()
    await methodsOf(wrapper).onClickSignOutButton()
    expect(routerPushes).to.deep.equal([{ path: '/' }])
  })
})
