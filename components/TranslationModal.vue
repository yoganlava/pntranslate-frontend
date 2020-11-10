<template>
  <div class="modal" :class="{'is-active': value}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{translationRow.text_id}}</p>
        <button class="delete" aria-label="close" @click="toggle"></button>
      </header>
      <section class="modal-card-body">
          <p>
              {{translationRow.source}}
          </p>
          <textarea class="current-text-area textarea" name="new-translation" v-model="newTranslation"/>
          <p class="error-message" v-if="errorMessage">{{errorMessage}}</p>
      </section>
      <footer class="modal-card-foot is-centered edit-footer">
        <button class="button is-success" @click="requestChange">Request changes</button>
        <button class="button" @click="toggle">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { Prop, Watch } from 'vue-property-decorator';
import Cookie from 'js-cookie';

@Component
export default class TranslationModal extends Vue {
    @Prop() value: boolean = false;
    @Prop() translationRow = {
      current: "",
      id: -1
    };
    newTranslation: string = "";
    errorMessage: string = "";

    @Watch('value')
    onLoad() {
        this.newTranslation = this.translationRow.current;
    }

    toggle() {
        this.errorMessage = "";
        this.$emit("input", !this.value);
    }

    async requestChange() {
        console.log(Cookie.get('access_token'));
        let res = await this.$axios.$post("/translate/request", {
            token: Cookie.get('access_token'), 
            translation_id: this.translationRow.id,
            new_content: this.newTranslation
        })

        if (res.error) {
            this.errorMessage = res.error;
            return;
        }
        this.$toast.success('Change requested')
        this.toggle()
    }
}
</script>

<style scoped>
.current-text-area {
    min-width: 300px;
    min-height: 300px;
    resize: none;
}

.edit-footer {
    display: inline;
}
</style>