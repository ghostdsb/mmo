import { Scene } from "phaser";
import { PlayerType } from "../enum";
import { CELL_SIZE } from "../game";

export class Player{
    private type: PlayerType
    private _id: string
    private _scene: Phaser.Scene
    private _x: number
    private _y: number
    private _scale: number
    private _texture: string
    private _container: Phaser.GameObjects.Container
    private _gameObject: Phaser.GameObjects.Sprite
    private _name: Phaser.GameObjects.Text
    private static GameObjectInstance: Player|null =null;
    public static getInstance():Player | null{
		return this.GameObjectInstance;
	}
    constructor(config:{scene: Scene,x: number,y: number,texture: string,tileIndex: number,scale:number, container: Phaser.GameObjects.Container, id: string}){
		this._initialiseVariables(config)
		this._addGameObject()
	}

	private _initialiseVariables({scene,x,y,texture,tileIndex,scale, container, id}){
		this._scene = scene
		this._x = x
		this._y = y
		this._id = id
		this._scale = scale
		this._texture = texture
		this._container = container
	}

    private _addGameObject(){
		this._gameObject = this._scene.add.sprite(this._x,this._y,this._texture).setScale(this._scale).setZ(999).setOrigin(0)
        this._name = this._scene.add.text(this._x+CELL_SIZE/2, this._y+CELL_SIZE/2, this._id, {color: "black"}).setOrigin(0.5)
		this._container.add(this._gameObject)
        this._container.add(this._name)
	}

	public getGameObject(){
		return this._gameObject
	}

    public move(dir: string){
        if(dir == "right"){
            this._x = this._gameObject.x + 80
            this._gameObject.setX(this._x)
            this._name.setX(this._x+CELL_SIZE/2)
        }else if(dir == "left"){
            this._x = this._gameObject.x - 80
            this._gameObject.setX(this._x)
            this._name.setX(this._x+CELL_SIZE/2)
        }else if(dir == "up"){
            this._y = this._gameObject.y - 80
            this._gameObject.setY(this._y)
            this._name.setX(this._y+CELL_SIZE/2)
        }else if(dir == "down"){
            this._y = this._gameObject.y + 80
            this._gameObject.setY(this._y) 
            this._name.setX(this._y+CELL_SIZE/2)
        }
    }

    public moveTo(coordiate: {x: number, y: number}){
        this._x = CELL_SIZE*coordiate.x;
        this._y = CELL_SIZE*coordiate.y;
        this._gameObject.setPosition(this._x, this._y)
        this._name.setPosition(this._x+CELL_SIZE/2, this._y+CELL_SIZE/2)
    }

    public getCoordinate(){
        return {x: Math.floor(this._x/CELL_SIZE), y: Math.floor(this._y/CELL_SIZE)}
    }

    public getId(){
        return this._id
    }

    public remove(){
        this._gameObject.setVisible(false)
        this._name.setVisible(false)
    }
}