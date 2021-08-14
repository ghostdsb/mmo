import {Socket} from "phoenix"
import { GameManager } from "./gamemanager";

export class Network{
    public static eventEmitter: Phaser.Events.EventEmitter;
    private static socket: Socket;
    public static playerId: string;
    private static worldChannel: any;
    public static isInputEnabled: boolean = true;
    public static init(): void {
        // const urlSearchParams = new URLSearchParams(window.location.search);
        // const params = Object.fromEntries(urlSearchParams.entries());
        this.playerId = GameManager.getPlayerId()
        // if (params.name) {
        //     this.playerId = params.name;
        // }
        this.eventEmitter = new Phaser.Events.EventEmitter();
        this.socket = new Socket(process.env.SOCKET_URL, {params: {userId: this.playerId}}); 
        this.socket.connect();
    }

    public static joinWorld(): void {
        this.worldChannel = this.socket.channel("game:nw_mmo", {userId: this.playerId})
        
        this.worldChannel.join()
          .receive("ok", ({messages}) => console.log("Joined WorldChannel Success", messages) )
          .receive("error", ({reason}) => console.log("failed to join WorldChannel", reason) )
          .receive("timeout", () => console.log("Networking issue. Timeout."))
        
        this.registerEvents();
    }

    public static sendMessage(event: string, msg: any): void {
        this.worldChannel.push(event, msg);
    }

    private static registerEvents() {
        // this.worldChannel.on("player_joined", this.onGameMap.bind(this))
        this.worldChannel.on("player_joined", this.onPlayerJoined.bind(this))
        this.worldChannel.on("move", this.onMoveUpdated.bind(this))
        this.worldChannel.on("player_terminated", this.onPlayerDied.bind(this));
        this.worldChannel.on("player_respawned", this.onPlayerRespawn.bind(this));
        this.worldChannel.on("player_left", this.onPlayerLeft.bind(this));
        this.worldChannel.on("player_rejoined", this.onPlayerRejoined.bind(this))


        window.addEventListener("beforeunload", this.onClientUnload.bind(this));
        window.addEventListener("unload", this.onClientUnload.bind(this));
    }

    private static onGameMap(msg: any): void {
        console.log("game map", msg);
        this.eventEmitter.emit("game_map", msg);
    }
    private static onPlayerJoined(msg: any): void {
        console.log("game map", msg);
        this.eventEmitter.emit("player_joined", msg);
    }

    private static onMoveUpdated(msg: any): void {
        this.eventEmitter.emit("move", msg);
    }

    private static onPlayerDied(msg: any): void {
        this.eventEmitter.emit("player_terminated", msg.id);
    }

    private static onPlayerRespawn(msg: any): void {
        // console.log("On player respawn", msg);
        this.eventEmitter.emit("player_respawn", msg);
    }

    private static onPlayerLeft(msg: any): void {
        // console.log("On player left", msg);
        this.eventEmitter.emit("player_left", msg);
    }

    private static onPlayerRejoined(msg: any): void {
        this.eventEmitter.emit("player_rejoined", msg);
    }

    private static onClientUnload(): void {
        this.worldChannel.leave();
    }
}