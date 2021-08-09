<template>
  <div>
    <b-jumbotron
      :bg-variant="locked ? 'info' : 'success'"
      text-variant="light"
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
    </b-jumbotron>
  </div>
</template>

<script>
import PincodeInput from 'vue-pincode-input'

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
      loading: false,
      iconAnimation: 'fade',
      locked: true
    }
  },
  // NOTE: 定数のように利用する変数、 props から算出できる値は computed に定義するよう心がけます。
  computed: {
  },
  watch: {
    pincode: function (val) {
      // 有効とみなすのは、4桁の入力のみです。
      if (val.length !== 4) {
        return
      }
      console.info({ pincode: val })
    }
  },
  async mounted () {
    // TODO: Heroku にせよ App Service にせよ、一度疎通確認をする。
  },
  // NOTE: 「methods に含めるのは template から利用する method のみ」原則を心がけます。
  methods: {
  }
}
</script>
