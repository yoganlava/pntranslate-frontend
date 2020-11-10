<template>
  <div class="modal" :class="{'is-active': value}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{translationRow.text_id}}</p>
        <button class="delete" aria-label="close" @click="toggle"></button>
      </header>
      <section class="modal-card-body">
          <p>{{newTranslation}}</p>
          <p class="error-message" v-if="errorMessage">{{errorMessage}}</p>
      </section>
      <footer class="modal-card-foot is-centered edit-footer">
        <button class="button is-danger" @click="finalise">Finalise</button>
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
export default class AlertModal extends Vue {
    @Prop() value: boolean = false;
    @Prop() translationRow = {
      current: "",
      id: -1
    };
    @Prop() newTranslation: string = "";
    errorMessage: string = "";


    toggle() {
        this.errorMessage = "";
        this.$emit("input", !this.value);
    }

    async finalise() {
        this.toggle()
        this.$emit('update');
    }
}
</script>

<style scoped>
.edit-footer {
    display: inline;
}
</style>