<template>
  <div class="login-container">
    <h2>登录</h2>
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="用户名"/>
      <input type="password" v-model="password" placeholder="密码"/>
      <button type="submit">登录</button>
    </form>
    <p>还没有账号？
      <router-link to="/register-view">立即注册</router-link>
    </p>
  </div>
</template>

<script>
// import router from "@/router";
import {ref} from "vue";
import $ from "jquery";
import {apiUrl} from "../../config";
import router from "@/router";
import usePeerStore from "@/store/peer";
import {initializePeerPlugin} from "@/plugins/initialization-peer";
import {initializeWebSocketPlugin} from "@/plugins/initialization-web-socket";

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const peerStore = usePeerStore();
    const error_message = ref('');

    const login = () => {
      $.ajax({
        url: `${apiUrl}/api/user/account/token/`,
        type: "post",
        data: {
          username: username.value,
          password: password.value,
        },
        success(resp) {
          if (resp.error_message === "success") {
            peerStore.token = resp.token;
            getinfo();
            router.push("/setting-view");
          } else {
            error_message.value = resp.error_message;
          }
        },
      });
    }
    const initializePlugin = async () => {
      try {
        await initializePeerPlugin();
        // 执行其他操作或设置其他变量
      } catch (error) {
        console.error("Failed to initialize Peer plugin:", error);
      }
    };

    const initializePlugin2 = async () => {
      try {
        await initializeWebSocketPlugin();
        // 执行其他操作或设置其他变量
      } catch (error) {
        console.error("Failed to initialize Peer plugin:", error);
      }
    };
    function getinfo() {
        $.ajax({
          url: `${apiUrl}/api/user/account/info/`,
          type: "get",
          headers: {
            Authorization: "Bearer " + peerStore.token,
          },
          success(resp) {
            if (resp.error_message === "success") {

              peerStore.username = resp.username;
              peerStore.is_login = true;
              peerStore.photo = resp.photo;
              peerStore.phone = resp.phone;
              peerStore.auth = resp.auth;
              router.push("/setting-view");
              initializePlugin();

              initializePlugin2();

            } else {
              console.log(resp.error_message)
            }
          },
          error(resp) {
            console.log(resp)
          }
        })
    }

    // const jwt_token = localStorage.getItem("jwt_token");
    const jwt_token = localStorage.getItem("jwt_token");
    if (jwt_token) {
      peerStore.token = jwt_token;
      try {
        peerStore.getinfo({
          success() {
            router.push("/setting-view");
            peerStore.pulling_info = false
          },
          error() {
            peerStore.pulling_info = false
          }
        });
        peerStore.pulling_info = false
      } catch (e) {
        console.log(e)
        peerStore.pulling_info = false
      }
    } else {
      peerStore.pulling_info = false
    }


    return {
      username,
      password,
      confirmPassword,
      login
    };
  }
};
</script>


<!-- 样式略 -->

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-container h2 {
  text-align: center;
}

.login-container form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.login-container input[type="text"],
.login-container input[type="password"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-container button {
  padding: 8px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>