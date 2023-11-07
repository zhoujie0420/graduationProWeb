<template>
  <section>
    <van-nav-bar title="设置"
                 fixed
                 placeholder
                 safe-area-inset-top/>
  </section>

  <section>
    <van-cell-group title="和作者一起研究" inset>
      <van-cell title="用户名" :value=" peerStore.username "/>
      <van-cell title="手机号" :value=" peerStore.phone" clickable/>
      <van-cell title="身份" value="test" clickable/>
    </van-cell-group>
  </section>

  <van-divider/>

  <li><a class="dropdown-item" href="#" @click="logout">退出</a></li>

</template>

<script setup>
import usePeerStore from "@/store/peer";

const logout = () => {

  localStorage.removeItem("jwt_token");
  peerStore.id = "";
  peerStore.username = "";
  peerStore.email = "";
  peerStore.photo = "";
  peerStore.token = "";
  peerStore.is_login = false;

}

const peerStore = usePeerStore();
</script>

<style scoped lang="scss">

</style>