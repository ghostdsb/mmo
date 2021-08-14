import FpsText from '../objects/fpsText'
import { Network } from '../manager/network'
import { Tile } from '../objects/tile'
import { Player } from '../objects/player'
import { TileType } from '../enum'
import { GameManager } from '../manager/gamemanager'
import { CELL_SIZE, WORLD_SIZE } from '../game'

export default class MainScene extends Phaser.Scene {
  fpsText
  private _xOff: number
  private _yOff:number
  private _cellSize: number
  private _boardContainer:Phaser.GameObjects.Container
  private _playerContainer:Phaser.GameObjects.Container
  private _enemyContainer:Phaser.GameObjects.Container
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys
  private canPress: boolean = true
  private player: Player
  private _playerList: Player[]
  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.canPress = true
    this._xOff = 0
    this._yOff = 0
    this._cellSize = CELL_SIZE
    this._playerList = []
    this._boardContainer = this.add.container(0,0).setDepth(1)
    this._enemyContainer = this.add.container(0,0).setDepth(2)
    this._playerContainer = this.add.container(0,0).setDepth(3)
    this.cursorKeys = this.scene.scene.input.keyboard.createCursorKeys();
    
    // this.placePlayer()

    Network.joinWorld();
    Network.eventEmitter.on("player_joined", this.onPlayerJoined, this);
    Network.eventEmitter.on("move", this.onPlayerMove, this);
    Network.eventEmitter.on("player_terminated", this.onPlayerTerminated, this);
    Network.eventEmitter.on("move_updated", this.onMoveUpdated, this);
    Network.eventEmitter.on("player_died", this.onPlayerDied, this)
  }

  private placePlayer(pos: {x: number, y: number}){
    let i = 5
    let j = 5
    let playerConfig = {
      scene: this,
      id: GameManager.getPlayerId(),
      x: this._xOff+(this._cellSize)*pos.x,
      y: this._yOff+(this._cellSize)*pos.y,
      texture:"player",
      tileIndex:0,
      scale:  1,
      container: this._playerContainer
    }
    this.player = new Player(playerConfig)
    this._playerList.push(this.player)
  }

  private placeEnemy(pos: {x: number, y: number}, id: string){
    let i = 5
    let j = 5
    let playerConfig = {
      id: id,
      scene: this,
      x: this._xOff+(this._cellSize)*pos.x,
      y: this._yOff+(this._cellSize)*pos.y,
      texture:"enemy",
      tileIndex:0,
      scale:  1,
      container: this._enemyContainer
    }
    let player = new Player(playerConfig)
    this._playerList.push(player)
  }

  private onPlayerJoined(data: any){
    console.log(data)
    this.drawGrid(data.map)
    if(data.id === GameManager.getPlayerId()){
      this.placePlayer(data.pos)
    }else{
      this.placeEnemy(data.pos, data.id, )
    }
    let enemies_id_list = Object.keys(data.players)
    for(let i=0; i< enemies_id_list.length; i++){
      let enemy_id = enemies_id_list[i]
      let pos = data.players[enemy_id]
      this.placeEnemy(pos, enemy_id)
    }
  }
  private onPlayerMove(data: any){
    console.log("id", data.id)
    console.log("gid", GameManager.getPlayerId())
    if(data.id === GameManager.getPlayerId()){
      console.log(" player move",data)
      this.player.moveTo(data.position)
    }
    for(let i=0; i< this._playerList.length; i++){
      if(data.id == this._playerList[i].getId()){
        this._playerList[i].moveTo(data.position)
      }
    }
    console.log(data)
  }

  private onPlayerTerminated(data: any){
    console.log("pleyer left", data)
    for(let i=0; i< this._playerList.length; i++){
      if(data == this._playerList[i].getId()){
        this._playerList[i].remove()
      }
    }
  }

  private onMoveUpdated(data: any){
    console.log(data)
  }

  private onPlayerDied(data: any){
    console.log(data)
  }

  private drawGrid(map: any) {

    let _tileIndex = 0
    let _tileScale = 1
    for(let j = 0; j < WORLD_SIZE; j++){
        for(let i = 0; i < WORLD_SIZE; i++){

            let tileConfig = {
                scene: this,
                x: this._xOff+(this._cellSize)*j,
                y: this._yOff+(this._cellSize)*i,
                texture: map[i][j]==0?"wall":"empty",
                tileType: map[i][j]==0?TileType.WALL:TileType.EMPTY,
                tileIndex:_tileIndex,
                scale:  _tileScale,
                container: this._boardContainer
            }
            new Tile(tileConfig)
            _tileIndex++
        }
    }
  }

  update() {
    // this.fpsText.update()
    let isUpDown = this.cursorKeys.up.isDown;
    let isDownDown = this.cursorKeys.down.isDown;
    let isLeftDown = this.cursorKeys.left.isDown;
    let isRightDown = this.cursorKeys.right.isDown;
    let isSpaceDown = this.cursorKeys.space.isDown;
    
    if(isUpDown && this.canPress){
      console.log("up")
      this.canPress = false
      this.sendPlayerMove({x: 0, y: -1})
      // this.player.move("up")
    }
    else if(isDownDown && this.canPress){
      console.log("down")
      this.canPress = false
      this.sendPlayerMove({x: 0, y: 1})
      // this.player.move("down")
    }
    else if(isLeftDown && this.canPress){
      console.log("left")
      this.canPress = false
      this.sendPlayerMove({x: -1, y: 0})
      // this.player.move("left")
    }
    else if(isRightDown && this.canPress){
      console.log("right")
      this.canPress = false
      this.sendPlayerMove({x: 1, y: 0})
      // this.player.move("right")
    }
    else if(isSpaceDown && this.canPress){
      console.log("space")
      this.canPress = false
      this.sendHit(this.player.getCoordinate())
    }
    if(!isDownDown && !isLeftDown && !isUpDown && !isRightDown && !isSpaceDown){
      this.canPress = true
    }
  }

  sendPlayerMove(moveDir){
    Network.sendMessage("move", {id: GameManager.getPlayerId(), dir: moveDir})
  }

  sendHit(pos){
    Network.sendMessage("hit", {id: GameManager.getPlayerId(), pos: pos})
  }
}
