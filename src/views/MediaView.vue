<template>
  <div>
    <div
      v-if="!showCollapseCamera"
      class="text-center"
    >
      <b-icon
        icon="camera-video"
        animation="cylon"
        font-scale="2"
      />
      Starting...
    </div>
    <b-collapse
      v-model="showCollapseCamera"
    >
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
          :disabled="loading"
          @click="onClickPredictButton"
        >
          <b-icon
            v-if="loading"
            icon="arrow-clockwise"
            animation="spin"
          />
          <b-icon
            v-else
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
    <b-card
      no-body
      class="m-3 p-3"
    >
      <b-button
        variant="outline-secondary"
        size="sm"
        @click="onClickTestButton"
      >
        Test
      </b-button>
    </b-card>
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

export default {
  name: 'MediaView',
  components: {
  },
  data () {
    return {
      cameraStream: null,
      loading: false,
      showCollapseCamera: false
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
    // TODO: カメラがうまく起動できなかったときの処理。
    if (!stream) {
      return
    }
    // NOTE: ここで video#player.srcObject に stream を指定するのが普通だが、この時点では DOM が非表示で指定できません。
    //       :srcObject.prop を利用して指定しています。
    this.cameraStream = stream
    setTimeout(() => {
      this.showCollapseCamera = true
    }, 3000)
  },
  // NOTE: 「methods に含めるのは template から利用する method のみ」原則を心がけます。
  methods: {
    onClickPredictButton: async function () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    onClickTestButton: async function () {
      console.info('test')
      if (this.showCollapseCamera) {
        stopStream(this.cameraStream)
        this.cameraStream = null
        this.showCollapseCamera = false
      } else {
        this.cameraStream = await startStream()
        setTimeout(() => {
          this.showCollapseCamera = true
        }, 3000)
      }
    }
  }
}
</script>
