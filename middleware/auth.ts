import {user} from '~/store'
export default async function (context){
    await user.fetchUser();
}