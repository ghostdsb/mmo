import { WORLD_SIZE } from "../game";
import { Tile } from "../objects/tile";

export class GameManager{
    private static playerId: string
    private tiles: Tile[]
    public static setPlayerId() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = urlSearchParams.get("name");
        console.log("name", params)
        this.playerId = params || "player" + Math.floor(Math.random() * 1000);
    }
    public static getPlayerId():string{
        return this.playerId
    }
    public setTiles(tiles){
        this.tiles = tiles
    }
    public getTileAt(index){

    }

    public convertToTwoD(index: number){
        let x = index%WORLD_SIZE
        let y = Math.floor(index/WORLD_SIZE)
        return {x, y}
    }
}