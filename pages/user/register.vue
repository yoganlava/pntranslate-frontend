<template>
  <div class="form">
    <div class="user-form">
      <h1 class="title" style="text-align: center">Register</h1>
      <div class="field">
        <label class="label">Username (4-16 characters)</label>
        <div class="control">
          <input class="input" type="text" placeholder="Username" v-model="userForm.username" />
        </div>
      </div>
      <div class="field">
        <label class="label">Password (4+ characters)</label>
        <div class="control">
          <input class="input" type="password" placeholder="Password" v-model="userForm.password" />
        </div>
      </div>
      <div class="control center-button">
        <button class="button is-link" @click="submitForm">Submit</button>
      </div>
      <div v-if="errorMessage">
        <p class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, namespace, getModule } from "nuxt-property-decorator";
import { Watch } from "vue-property-decorator";
import { user } from "~/store";
import Cookie from "js-cookie";
interface UserForm {
  username: string;
  password: string;
}

@Component
export default class RegisterForm extends Vue {
  userForm = {} as UserForm;
  errorMessage: string = "";

  created() {
    if (this.$store.state.user.userInfo.username) this.$router.push("/");
  }

  async submitForm() {
    let res = await user.registerUser(this.userForm);
    if (res.error) {
      this.errorMessage = res.error;
      return;
    }
    Cookie.set("access_token", res.token);
    this.$router.push("/");
  }
}
</script>


<style>
.form {
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-form {
  max-width: 500px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 15px 35px 0 rgba(60, 66, 87, 0.12),
    0 5px 15px 0 rgba(0, 0, 0, 0.12);
}

.center-button {
  display: flex;
  justify-content: center;
}

.error-message {
  color: hsl(348, 100%, 61%);
  text-align: center;
  margin: 10px 0px;
}
</style>