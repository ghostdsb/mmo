import { Scene } from "phaser"
import { TileType } from "../enum"
// import { GameManager } from "../managers/gameManager"
// import PlayerData from "../managers/playerDataManager"
// import { getPlayingSigns, getWinTexture, IMAGE_FILES, PLAYER_SIGN, TEXTURE_ATLAS } from "../utils/constants"

export class Tile{
	private _scene: Phaser.Scene
	private _x: number
	private _y: number
	private _scale:number
	private _texture: string
	private _tileIndex:number
    private _tileType: TileType
	private _container: Phaser.GameObjects.Container
	private _gameObject: Phaser.GameObjects.Sprite
	private static GameObjectInstance: Tile|null=null;
	public static getInstance():Tile|null{
		return this.GameObjectInstance;
	}			
	constructor(config:{scene: Scene,x: number,y: number,texture: string,tileIndex: number,scale:number, container: Phaser.GameObjects.Container, tileType: TileType}){
		this._initialiseVariables(config)
		this._addGameObject()
	}

	private _initialiseVariables({scene,x,y,texture,tileIndex,scale, container, tileType}){
		this._scene = scene
		this._x = x
		this._y = y
		this._scale = scale
		this._texture = texture
		this._tileIndex = tileIndex
		this._container = container
		this._tileType = tileType

	}
	
	private _addGameObject(){
		this._gameObject = this._scene.add.sprite(this._x,this._y,this._texture).setScale(this._scale).setZ(1).setOrigin(0)
		this._container.add(this._gameObject)
	}

	public getGameObject(){
		return this._gameObject
	}

    public getType(){
        return this._tileType
    }
}
