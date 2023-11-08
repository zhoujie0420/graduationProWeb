import ReconnectingWebSocket from "reconnecting-websocket";
import networkConfiguration from "@/network/configuration";
import {showToast} from "vant";
import { useStore } from 'vuex'

export default function (username) {
    const store = useStore();

    let {host, port, path} = {...networkConfiguration.server.webSocketServer};
    let connection = new ReconnectingWebSocket(`ws://${host}:${port}${path}/${username}`);

    connection.onmessage = event => {
        let message = JSON.parse(event.data);
        store.state.onlineList = message;
        console.log("webSocketConnection.onmessage:", message);
    };

    connection.onclose = event => {
        console.log("webSocketConnection.onclose:", event);
        showToast("network connection closed");
    };

    connection.onerror = event => {
        console.log("webSocketConnection.onerror:", event);
        showToast("network connection error");
    };

    connection.onopen = event => {
        console.log("webSocketConnection.onopen:", event);
    };
}