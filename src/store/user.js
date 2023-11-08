import $ from 'jquery'
import {apiUrl} from "../../config";
import initializePeerjs from "../plugins/initialization-peer/index";
import initializeWebSocketPlugin from "../plugins/initialization-web-socket/index";
export default {
    state: {
        id: "",
        username: "",
        photo: "",
        token: "",
        email: "1 ",
        is_login: false,
        pulling_info: true,  // 是否正在从云端拉取信息
        onlineList: [],
        /**
         * 本地对等体对象
         */
        localPeer: undefined,
        /**
         * 正在通话的数据连接对象
         */
        dataConnection: undefined,
        /**
         * 正在通话的媒体连接对象
         * @function mediaConnection.on
         */
        mediaConnection: undefined,
        /**
         * 是否激活通知
         */
        activateNotification: false,
        /**
         * 视频通话指令枚举值
         */
        instruction: {
            /**
             * 请求视频通话
             */
            request: 1,
            /**
             * 拒绝视频通话
             */
            reject: 2,
            /**
             * 接受视频通话
             */
            accept: 3,
            /**
             * 取消视频通话
             */
            cancel: 4,
            /**
             * 正常挂断
             */
            ringOff: 5,
            /**
             * 忙碌挂断
             */
            busy: 6
        },
    },
    getters: {
    },
    mutations: {
        updatePhoto (state, photo) {
            state.photo = photo;
          },
        updateUsername (state, username) {
            state.username = username;
        },  // 更新用户名  未使用
        
        updateUser(state, user) {
            state.id = user.id;
            state.username = user.username;
            state.email = user.email;
            state.photo = user.photo;
            state.is_login = user.is_login;
            state.rating = user.rating;
        },
        updateToken(state, token) {
            state.token = token;
        },
  
        logout(state) {
            state.id = "";
            state.username = "";
            state.email = "";
            state.photo = "";
            state.token = "";
            state.is_login = false;
        },
        updatePullingInfo(state, pulling_info) {
            state.pulling_info = pulling_info;
        }
    },
    actions: {
        login(context, data) {
            $.ajax({
                url: `${apiUrl}/api/user/account/token/`,
                type: "post",
                data: {
                    username: data.username,
                    password: data.password,
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        localStorage.setItem("jwt_token", resp.token);
                        context.commit("updateToken", resp.token);
                        data.success(resp);
                    } else {
                        data.error(resp);
                    }
                },
                error(resp) {
                    data.error(resp);
                }
            });
        },
        getinfo(context, data) {
            $.ajax({
                url: `${apiUrl}/api/user/account/info/`,
                type: "get",
                headers: {
                    Authorization: "Bearer " + context.state.token,
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        context.commit("updateUser", {
                            ...resp,
                            is_login: true,
                        });
                        data.success(resp);
                        console.log(resp);
                        initializePeerjs(resp.username);
                        initializeWebSocketPlugin(resp.username);
                    } else {
                        data.error(resp);
                    }
                },
                error(resp) {
                    data.error(resp);
                }
            })
        },
        logout(context) {
            localStorage.removeItem("jwt_token");
            context.commit("logout");
        }
    },
    modules: {
    }
}