import Peer from "peerjs";
import networkConfiguration from "@/network/configuration";
import {showToast} from "vant";
import {useStore} from 'vuex'

export default function (username) {
    let store = useStore();
    let {host, port, path} = {...networkConfiguration.server.peerServer};
    let localPeer = new Peer(username, {host, port, path});

    localPeer.on("connection", dataConnection => {
        console.log("localPeer on connection", dataConnection);
        if (store.state.username.dataConnection) {
            dataConnection.on("open", () => {
                dataConnection.send({
                    instruction: store.state.username.instruction.busy
                });
            });
        } else {
            dataConnection.on("data", data => {
                console.log("dataConnection data", data);

                //请求通话
                if (data.instruction === store.state.username.instruction.request) {
                    store.state.username.dataConnection = dataConnection;
                    //激活通知
                    store.state.username.activateNotification = true;
                }

                //对方取消
                else if (data.instruction === store.state.username.instruction.cancel) {
                    //关闭数据连接
                    store.state.username.dataConnection.close();
                    store.state.username.dataConnection = undefined;
                    //取消激活通知
                    store.state.username.activateNotification = false;
                }

                //对方挂断
                else if (data.instruction === store.state.username.instruction.ringOff) {
                    //关闭数据连接
                    store.state.username.dataConnection.close();
                    store.state.username.dataConnection = undefined;
                    //关闭媒体连接
                    store.state.username.mediaConnection.close();
                    store.state.username.mediaConnection = undefined;
                }
            });
        }
    });

    localPeer.on("call", mediaConnection => {
        console.log("localPeer call", mediaConnection);
        store.state.username.mediaConnection = mediaConnection;
    });

    localPeer.on("disconnected", () => {
        console.warn("localPeer disconnected");
        localPeer.reconnect();
        showToast("video call component disconnected");
    });

    localPeer.on("error", error => {
        console.error("localPeer error,the error information is : ", JSON.stringify(error));
        showToast("video call component error");
    });

    localPeer.on("open", localPeerId => {
        console.log("localPeer opened,the local peer id is: ", localPeerId);
        store.state.username.localPeer = localPeer;
    });
}