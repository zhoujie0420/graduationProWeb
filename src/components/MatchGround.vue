<template>
    <div class="matchground">
      <div class="row">

        <section>
          <van-nav-bar title="朋友"
                       fixed
                       placeholder
                       safe-area-inset-top/>
        </section>


        <section v-if="friendStore.onlineList.length">
          <van-divider>在线的朋友 轻触可开始视频聊天</van-divider>
          {{$store.state.onlineList}}
            <friend-card
                         @click="jumpToVideoCallCallingView(store.state.username)">
              {{ $store.state.user.username }}
            </friend-card>
          </section>

      </div>
    </div>
  </template>
  
  <script setup>
  import { useStore } from "vuex"
  import {showToast} from "vant";
  import router from "@/router";

  const store = useStore();


  function jumpToVideoCallCallingView(calleePeerId) {
    if (store.state.user.localPeer && store.state.user.localPeer.open) {
      if (store.state.user.dataConnection) {
        showToast("currently busy");
      } else {
        router.push({
          path: "/video-call-calling-view",
          query: {
            calleePeerId
          }
        });
      }
    } else {
      showToast("local peer not opened");
    }
  }

  </script>
  
  <style scoped>
  
  div.matchground {
      width: 60vw;
      height: 70vh;
      background-color:rgba(50 ,50 ,50 ,0.5);
      margin: 40px auto;
  }
  div.user-photo {
      text-align: center;
      padding-top: 10vh;
  }
  div.user-photo > img{
      border-radius: 50%;
      width: 20vh;
  }
  div.user-username {
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      color: white;
      margin-top: 2vh;
  }
  div.user-select-bot {
      padding-top: 20vh;
  }
  div.user-select-bot > select {
      width: 60%;
      margin: 0 auto;
  }
  
  </style>
  
