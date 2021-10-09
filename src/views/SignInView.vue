<template>
  <!--
    SignInView
    最初にやってくる、サインイン用のページです。
  -->
  <div>
    <!-- NOTE: position-relative は b-overlay no-wrap の動作に必須です。 -->
    <b-jumbotron
      :bg-variant="locked ? 'info' : 'success'"
      text-variant="light"
      class="position-relative"
    >
      <template #header>
        <div class="text-center">
          <b-icon
            v-if="locked"
            icon="lock"
            class="border border-light rounded p-2"
            :animation="iconAnimation"
            font-scale="2"
          />
          <b-icon
            v-else
            icon="unlock"
            class="border border-light rounded p-2"
            font-scale="2"
          />
        </div>
      </template>
      <hr class="my-4">
      <p class="text-center">
        <PincodeInput
          v-model="pincode"
          placeholder="0"
          :length="4"
          :autofocus="true"
        />
      </p>
      <p>
        Flower Stuff Lab EASY WEB | Enter your pin code above.
      </p>
      <b-overlay
        :show="showJumbotronOverlay"
        no-wrap
      />
    </b-jumbotron>
  </div>
</template>

<script>
import PincodeInput from 'vue-pincode-input'
import pnotifyUtils from '@/utils/pnotifyUtils'
import { getStatus, verifyPincode } from '@/api'

// アイコンを揺らし、ページ遷移を行います。
// NOTE: 演出のための処理です。
const animateAndGoToMediaView = function (component) {
  component.showJumbotronOverlay = true
  // ロック状態のアイコンを揺らします。
  component.iconAnimation = 'cylon'
  // ロックアイコン -> アンロックアイコンにチェンジ。
  setTimeout(() => {
    component.showJumbotronOverlay = false
    component.locked = false

    // アンロックアイコンを見せたあと、遷移します。
    setTimeout(() => {
      component.$router.push({ path: '/media' })
    }, 1500)
  }, 1500)
}

export default {
  name: 'SignInView',
  components: {
    PincodeInput
  },
  data () {
    return {
      // 外部モジュール vue-pincode-input によって取得します。
      pincode: '',

      // 演出のための data です。
      showJumbotronOverlay: true,
      iconAnimation: 'fade',
      locked: true
    }
  },
  // NOTE: 定数のように利用する変数、 props から算出できる値は computed に定義するよう心がけます。
  computed: {
  },
  watch: {
    pincode: async function (val) {
      // 有効とみなすのは、4桁の入力のみです。
      if (val.length !== 4) {
        return
      }
      // 検証するのは locked 状態のときのみです。
      if (!this.locked) {
        return
      }
      // pincode の検証を行います。
      const result = await verifyPincode(val)
      // message が入っているとき、エラーが発生しています。
      if ('message' in result) {
        pnotifyUtils.popHidingError(result.message)
        return
      }
      const verificationSucceeded = result.verification_succeeded
      if (verificationSucceeded) {
        animateAndGoToMediaView(this)
        return
      }
      pnotifyUtils.popHidingError('Invalid pincode.')
    }
  },
  async mounted () {
    // サーバ側が準備万端であることを確認します。
    const serverIsReady = (await getStatus()).ready
    if (serverIsReady) {
      this.showJumbotronOverlay = false
      return
    }
    pnotifyUtils.popError('Sorry, the server is not ready.')
  },
  // NOTE: 「methods に含めるのは template から利用する method のみ」原則を心がけます。
  methods: {
  }
}
</script>
