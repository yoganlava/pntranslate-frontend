<template>
  <div class="container">
    <translation-modal v-model="showModal" :translation-row="selectedRow"/>
    <alert-modal v-model="showAlert" :translation-row="selectedRow" :new-translation="selectedRow.current" @update="finalise"/>
    <div>
      <h1 class="title">Translation progress</h1>
      <h2 class="subtitle">{{progressValue}} / 45736</h2>
      <progress class="progress is-success" :value="progressValue" max="45736"></progress>
      <div class="title-div">
          <input v-model="query" type="text" name="query" class="input search" placeholder="Translation ID">
          <span style="flex-grow: 0.34454;"></span>
        <h1 class="title">Translation list</h1>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Translation ID</th>
            <th>Indonesian</th>
            <th>English</th>
            <th>Last Translated By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{item.text_id}}</td>
            <td>{{item.source}}</td>
            <td>{{item.current}}</td>
            <td>{{item.current_user}}</td>
            <td>
              <p v-if="!$store.state.user.userInfo.username">Please log in</p>
              <p v-if="$store.state.user.userInfo.username && !item.free">Translation undergoing review</p>
              <button class="button is-primary" v-if="$store.state.user.userInfo.username && item.free" @click="toggleModal(item)">Edit</button>
              <button v-if="$store.state.user.userInfo.moderator && item.free" class="button is-danger is-light" @click="toggleAlert(item)">Finalise</button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav class="pagination is-centered" role="navigation" aria-label="pagination">
        <a @click="decrementPage" class="pagination-previous">Previous</a>
        <a @click="incrementPage" class="pagination-next">Next page</a>
        <div class="pagination-list">
          <label class="label pagination-label">Row Count:</label>
          <input
            class="row-number"
            type="number"
            name="rowNumber"
            v-model="limit"
            @blur="refreshTable"
          />
          <label class="label pagination-label">Page Number:</label>
          <input
            class="page-number"
            type="number"
            name="pageNumber"
            v-model="pageNumber"
            @blur="refreshTable"
          />
        </div>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import { Watch } from "vue-property-decorator";
import Cookie from 'js-cookie';

@Component({
  components: {
    TranslationModal: () => import("~/components/TranslationModal.vue"),
    AlertModal: () => import("~/components/AlertModal.vue")
  }
})
export default class Index extends Vue {
  items = {};
  showModal: boolean = false;
  showAlert: boolean = false;
  limit: number = 10;
  pageNumber: number = 1;
  progressValue: number = 1;
  query: string = "";
  selectedRow = {
    id: ""
  };

  created() {
    this.refreshPage()
  }

  @Watch("pageNumber")
  @Watch("limit")
  @Watch("query")
  async refreshTable() {
    this.items = await this.$axios.$get(
      `/translate/getall?limit=${this.limit}&offset=${(this.pageNumber - 1) * this.limit}&query=${this.query}`
    );
  }

  async getProgressValue(){
    this.progressValue = (await this.$axios.$get("/translate/getprogress")).finalCount
  }

  incrementPage() {
    this.pageNumber++;
  }

  decrementPage() {
    this.pageNumber = Math.max(1, this.pageNumber - 1);
  }

  toggleModal(selectedRow) {
    this.showModal = !this.showModal;
    this.selectedRow = selectedRow;
  }

  toggleAlert(selectedRow) {
    this.showAlert = !this.showAlert;
    this.selectedRow = selectedRow;
  }

  async finalise(){
    await this.$axios.post("/translate/finalise",
    {
      access_token: Cookie.get('access_token'),
      translation_id: this.selectedRow.id
    })
    this.$toast.success('Translation finalised');
    this.refreshPage();
  }

  refreshPage() {
    this.refreshTable();
    this.getProgressValue();
  }
}
</script>

<style scoped>

.search {
  max-width: 20%;
}

.title-div {
    display: flex;
    justify-content: flex-start;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.page-number,
.row-number {
  max-width: 10%;
}

.pagination-label {
  padding-top: 5px;
  padding-right: 10px;
  padding-left: 10px;
}
</style>
