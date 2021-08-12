<template>
  <!--
    MediaView
    撮影、予測結果の表示を行うメイン view です。
  -->
  <div>
    <!-- NOTE: position-relative は b-overlay no-wrap の動作に必須です。 -->
    <div
      v-if="showCameraIsStartingMessage"
      class="position-relative"
      style="height: 200px;"
    >
      <b-overlay
        :show="true"
        no-wrap
      >
        <template #overlay>
          <div class="text-center">
            <b-icon
              icon="camera-video"
              scale="2"
              animation="fade"
            />
          </div>
          <div>
            Camera is starting ...
          </div>
        </template>
      </b-overlay>
    </div>

    <b-alert
      :show="showCameraIsUnavailableMessage"
      variant="warning"
      class="m-3"
    >
      <b-icon
        icon="camera-video-off"
      />
      This application needs to access your camera.
      <b-button
        variant="warning"
        block
        class="mt-3"
        @click="onClickSignOutButton"
      >
        <b-icon
          icon="door-open"
        />
        Sign out
      </b-button>
    </b-alert>

    <b-collapse
      v-model="showCollapseCamera"
      class="position-relative"
    >
      <b-overlay
        :show="showCollapseCameraOverlay"
        no-wrap
      >
        <template #overlay>
          <div class="text-center">
            <b-icon
              icon="cloud-upload"
              scale="2"
              animation="fade"
            />
          </div>
          <div>
            Sending and predicting ...
          </div>
        </template>
      </b-overlay>
      <!--
        カメラ映像を流す video 要素です。
        NOTE: autoplay playsinline は iOS で動作させるため必要です。
              webkit style は左右反転表示です。
      -->
      <video
        ref="video"
        :srcObject.prop="cameraStream"
        autoplay
        playsinline
        class="w-100"
        style="-webkit-transform: scaleX(-1)"
      />
      <div
        class="m-3"
      >
        <b-button
          variant="primary"
          block
          :disabled="showCollapseCameraOverlay"
          @click="onClickPredictButton"
        >
          <b-icon
            icon="cloud-upload"
          />
          Predict
        </b-button>
      </div>
      <b-alert
        show
        class="m-3"
      >
        <b-icon
          icon="hand-index"
        />
        Capture a flower on the camera. Then tap the Predict button.
        The photos will be sent to the server, but won't be saved.
      </b-alert>
    </b-collapse>

    <b-collapse
      v-model="showCollapsePredictionResult"
    >
      <b-card
        :img-src="imgSrcBase64"
        img-top
        class="m-3"
        title="Prediction result"
        :sub-title="`v${predictionVersion}`"
      >
        <b-list-group flush>
          <b-list-group-item
            v-for="result in predictionResults"
            :key="result.id"
          >
            {{ result.name }}: {{ result.confidence }}<br>
            <b-link
              :href="`https://www.google.com/search?q=${result.name}+flower&tbm=isch`"
              target="_blank"
            >
              <b-icon
                icon="search"
              />
              (Google)
            </b-link>
          </b-list-group-item>
        </b-list-group>
        <div>
          <b-button
            variant="primary"
            block
            class="mt-3"
            @click="onClickBackButton"
          >
            <b-icon
              icon="camera-video"
            />
            Back to camera
          </b-button>
        </div>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
// Stream を指定してカメラを stop します。
const stopStream = function (stream) {
  const tracks = stream.getTracks()
  tracks.forEach(function (track) {
    track.stop()
  })
}

// カメラを起動し、ストリームを返り値に得ます。
const startStream = async function () {
  // WARN: 環境によっては navigator.mediaDevices が存在しません。
  try {
    // カメラ映像をモーダルに表示するための機能(aspectRatio width height facingMode あたり)がサポートされているかどうか確認します。
    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints()
    if (!(supportedConstraints.aspectRatio &&
          supportedConstraints.width &&
          supportedConstraints.height &&
          supportedConstraints.facingMode)) {
      return false
    }

    // NOTE: getUserMedia のコール時にユーザへのカメラ使用是非を問います。
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        // NOTE: 一部の iOS Safari でのみ確認している問題ですが、
        //       aspectRatio 等の指定があると facingMode が勝手に environment へ変更される問題があります。
        // aspectRatio: 1.777777,
        // width: {min: 640, max: 1920},
        // height: {min: 360, max: 1080},
        facingMode: 'environment' // user: front camera, environment: rear camera
      }
    })
  } catch (err) {
    console.info({ err })
    return null
  }
}

// video タグから画像を取得します。
const getVideoFrameAsBase64 = function (videoElement) {
  // 各要素です。
  const canvasElement = document.createElement('canvas')

  // video が生成されていなければ終了です。
  // NOTE: video が表示される前にボタンを押したりすると状況が発生します。
  if (!videoElement) {
    return
  }

  // video の大きさを取得します。
  const videoWidth = videoElement.offsetWidth * 0.5
  const videoHeight = videoElement.offsetHeight * 0.5

  // canvas の大きさを video と合わせます。
  canvasElement.setAttribute('width', videoWidth)
  canvasElement.setAttribute('height', videoHeight)

  // video -> canvas 書き出します。
  canvasElement.getContext('2d').drawImage(videoElement, 0, 0, videoWidth, videoHeight)

  // base64 に変換します。
  const base64Image = canvasElement.toDataURL('image/jpg')

  return base64Image
}

export default {
  name: 'MediaView',
  components: {
  },
  data () {
    return {
      showCameraIsStartingMessage: true,
      showCameraIsUnavailableMessage: false,
      cameraStream: null,
      showCollapseCameraOverlay: false,
      showCollapseCamera: false,
      showCollapsePredictionResult: false,
      imgSrcBase64: '',
      predictionResults: [],
      predictionVersion: ''
    }
  },
  // NOTE: 定数のように利用する変数、 props から算出できる値は computed に定義するよう心がけます。
  computed: {
  },
  watch: {
  },
  async mounted () {
    // カメラを起動します。
    const stream = await startStream()
    // カメラがうまく起動できなかったときの処理です。
    if (!stream) {
      setTimeout(() => {
        this.showCameraIsUnavailableMessage = true
        this.showCameraIsStartingMessage = false
      }, 1000)
      return
    }
    // NOTE: ここで video#player.srcObject に stream を指定するのが普通だが、この時点では DOM が非表示で指定できません。
    //       :srcObject.prop を利用して指定しています。
    this.cameraStream = stream
    setTimeout(() => {
      this.showCameraIsStartingMessage = false
      this.showCollapseCamera = true
    }, 5000)
  },
  // NOTE: 「methods に含めるのは template から利用する method のみ」原則を心がけます。
  methods: {
    onClickPredictButton: async function () {
      this.showCollapseCameraOverlay = true

      // 画像を base64 で取得します。
      this.imgSrcBase64 = getVideoFrameAsBase64(this.$refs.video)
      // 画像が存在しなければ処理を続ける理由はありません。
      if (!this.imgSrcBase64) {
        this.showCollapseCameraOverlay = false
        return
      }

      // TODO: 画像を API へ送信。
      //       Prediction 結果が返ってくるハズ。
      const predictionResult = {
        result: [
          { name: 'Windflower', confidence: 0.6562319 },
          { name: 'Pansy', confidence: 0.16973963 },
          { name: 'Snowdrop', confidence: 0.119459644 }
        ],
        version: '0.0.0'
      }
      this.predictionResults = predictionResult.result
      this.predictionVersion = predictionResult.version

      setTimeout(() => {
        this.showCollapseCameraOverlay = false
        // カメラ停止、カメラエリアを閉じて、予測結果エリアを開きます。
        stopStream(this.cameraStream)
        this.cameraStream = null
        this.showCollapseCamera = false
        // NOTE: ふたつの collapse がほぼ同時に開閉すると美しくなかったので、
        //       順繰りに動作するようにしています。
        setTimeout(() => {
          this.showCollapsePredictionResult = true
        }, 500)
      }, 5000)
    },
    onClickBackButton: async function () {
      // 予測結果エリアの data 変数を初期化して、カメラエリアを再び開きます。
      this.showCameraIsStartingMessage = true
      this.showCollapsePredictionResult = false
      this.imgSrcBase64 = ''
      this.predictionResults = []
      this.predictionVersion = ''
      this.cameraStream = await startStream()
      setTimeout(() => {
        this.showCameraIsStartingMessage = false
        this.showCollapseCamera = true
      }, 3000)
    },
    onClickSignOutButton: function () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
