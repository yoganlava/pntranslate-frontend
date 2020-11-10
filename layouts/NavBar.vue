<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <!-- <a class="navbar-item" href="https://bulma.io">
        <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" />
      </a>-->
      <nuxt-link to="/" class="navbar-item">
        <h1 class="title">PNTranslate</h1>
      </nuxt-link>

      <a
        @click="toggle"
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        :class="{'is-active': showNav}"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu" :class="{'is-active': showNav}">
      <div class="navbar-start">
        <nuxt-link to="/admin" class="navbar-item" v-if="$store.state.user.userInfo.moderator">Admin Panel</nuxt-link>
      </div>
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link" v-if="$store.state.user.userInfo.username">{{$store.state.user.userInfo.username}}</a>
          <div class="navbar-dropdown">
            <a class="navbar-item" @click="logout()" v-if="$store.state.user.userInfo.username">Log out</a>
          </div>
        </div>
        <div class="navbar-item">
          <div class="buttons">
            <nuxt-link
              v-if="!$store.state.user.userInfo.username"
              to="/user/register"
              class="button is-primary"
            >Sign up</nuxt-link>
            <nuxt-link
              v-if="!$store.state.user.userInfo.username"
              to="/user/login"
              class="button is-light"
            >Log in</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import Cookie from 'js-cookie';
import { user } from "../store";
@Component
export default class DefaultLayout extends Vue {
  showNav: boolean = false;
  toggle() {
    this.showNav = !this.showNav;
  }

  async logout(){
    await this.$axios.post("/user/logout", {access_token: Cookie.get('access_token')});
    await user.fetchUser();
    this.$forceUpdate()
  }
}
</script>
<style>
.navbar-dropdown {
  left: -15px;
}
</style>

