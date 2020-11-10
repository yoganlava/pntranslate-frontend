<template>
  <div class="container">
    <alert-modal v-model="showAlert" :translation-row="selectedRow" :new-translation="newTranslation" @update="approveAndFinalise"/>
    <div>
      <h1 class="title">Admin Panel</h1>
      <table class="table">
        <thead>
          <tr>
            <th>Translation ID</th>
            <th>Indonesian</th>
            <th>Old</th>
            <th>New</th>
            <th>Request by</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{item.__translation__.text_id}}</td>
            <td>{{item.__translation__.source}}</td>
            <td>{{item.__translation__.current}}</td>
            <td>{{item.new_content}}</td>
            <td>{{item.user}}</td>
            <td>
              <button class="button is-primary" @click="approveRequest(item.id)">Approve</button>
              <button class="button is-danger" @click="denyRequest(item.id)">Deny</button>
              <button class="button is-danger is-light" @click="toggleAlert(item)">Approve & Finalise</button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav class="pagination is-centered" role="navigation" aria-label="pagination">
        <a @click="decrementPage" class="pagination-previous">Previous</a>
        <a @click="incrementPage" class="pagination-next">Next page</a>
        <div class="pagination-list">
          <label class="label pagination-label">Row Count:</label>
          <input class="row-number" type="number" v-model="limit" @blur="refreshTable" />
          <label class="label pagination-label">Page Number:</label>
          <input class="page-number" type="number" v-model="pageNumber" @blur="refreshTable" />
        </div>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import { Watch } from "vue-property-decorator";
import Cookie from "js-cookie";

@Component({
  components: {
    AlertModal: () => import("~/components/AlertModal.vue")
  }
})
export default class Admin extends Vue {
  items: Array<any> = [];
  limit: number = 10;
  pageNumber: number = 1;
  showAlert: boolean = false;
  requestID: number = 0;
  newTranslation: string;
  selectedRow = {
    id: ""
  };
  created() {
    if(!this.$store.state.user.userInfo.moderator){
        this.$router.push("/")
    }
    this.refreshTable();
  }

  @Watch("pageNumber")
  @Watch("limit")
  async refreshTable() {
    this.items = await this.$axios.$get(
      `/translate/getallrequests?limit=${
        this.limit
      }&offset=${(this.pageNumber - 1) * this.limit}`
    );
    
    console.log(this.items[0]);
    
  }

  incrementPage() {
    this.pageNumber++;
  }

  decrementPage() {
    this.pageNumber = Math.max(1, this.pageNumber - 1);
  }

  toggleAlert(selectedRow) {
    this.showAlert = !this.showAlert;
    this.requestID = selectedRow.id;
    this.newTranslation = selectedRow.new_content;
    this.selectedRow = selectedRow.__translation__;
  }

  async approveRequest(requestID) {
    await this.$axios.post("/translate/approverequest", {
      token: Cookie.get("access_token"),
      requestID: requestID
    });
    this.$toast.success('Request approved');
    this.refreshTable();
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async denyRequest(requestID) {
    await this.$axios.post("/translate/denyrequest", {
      token: Cookie.get("access_token"),
      requestID: requestID
    });
    this.$toast.error('Request denied');
    this.refreshTable();
  }

  async approveAndFinalise(){
    await this.approveRequest(this.requestID);
    await this.$axios.post("/translate/finalise",
    {
      access_token: Cookie.get('access_token'),
      translation_id: this.selectedRow.id
    })
    this.$toast.success('Translation finalised');
    this.refreshTable();
  }
}
</script>