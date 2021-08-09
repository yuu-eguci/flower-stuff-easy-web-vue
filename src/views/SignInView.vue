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
      <p>
        ここに pin code form の予定。
        <b-form inline>
          <b-form-input
            ref="focusThis"
            v-model="invitationCodeChar1"
            :disabled="loading"
            placeholder="0"
            size="lg"
          />
          <b-form-input
            v-model="invitationCodeChar2"
            :disabled="loading"
            placeholder="0"
            size="lg"
          />
          <b-form-input
            v-model="invitationCodeChar3"
            :disabled="loading"
            placeholder="0"
            size="lg"
          />
          <b-form-input
            v-model="invitationCodeChar4"
            :disabled="loading"
            placeholder="0"
            size="lg"
          />
        </b-form>
      </p>
    </b-jumbotron>
  </div>
</template>

<script>
export default {
  name: 'SignInView',
  components: {
  },
  data () {
    return {
      invitationCodeChar1: '',
      invitationCodeChar2: '',
      invitationCodeChar3: '',
      invitationCodeChar4: '',

      // 演出のための data です。
      loading: false,
      iconAnimation: 'fade',
      locked: true
    }
  },
  async mounted () {
    this.$refs.focusThis.focus()
  }
}
</script>
