import { Module, VuexModule, Mutation, Action, MutationAction } from 'vuex-module-decorators';
import { $axios } from '~/utils/api';
import Cookie from 'js-cookie';

interface UserData {
    username: string,
    moderator: boolean,
    approved_counter: number
}
@Module({
  name: 'user',
  stateFactory: true,
  namespaced: true,
})
export default class User extends VuexModule {
    public userInfo: UserData = {
        username: "",
        moderator: false,
        approved_counter: 0
    }

    get getUser(): UserData {
        return this.userInfo;
    }

    @MutationAction({ mutate: ['userInfo'] })
    async fetchUser(){
        const userData = await $axios.$get(`/user/getuser?token=${Cookie.get('access_token')}`);
        if (userData == undefined || userData.error)
            return {userInfo: {
                username: "",
                moderator: false,
                approved_counter: 0
            } as UserData};
        return {userInfo: userData};
    }

    @Action
    async submitLogin(form): Promise<any> {
        // console.log()
        const res = await $axios.$post('/user/login', form);
        console.log(res);
        return res;
    }

    @Action
    async registerUser(form): Promise<any> {
        console.log(form);
        const res = await $axios.$post('/user/register', form);
        return res;
    }
}