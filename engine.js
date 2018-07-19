//TODO: вынести Scene, SceneObject и State в отдельный файл
//TODO: всё, что связано с текстурами и тайлами -- тоже

let game = null;//new GameState();
let menu = null;
let credits = null;
let leaderboards = null; //TODO
let settings = null; //TODO
let gameOver = null;//new GameOverState();
let charCreation = null;

class Scene {
    constructor(canvas) {               // разве scene != canvas ?
        //Юра, и зачем ты это пишешь если не используем
        this.ctx = canvas.getContext("2d");
        this.state = null;
        this.eventList = {}
    }
    setState(state) {
        //remove old handlers
        for (let oldEvent in this.eventList) {
            console.log("Remove old handlers", oldEvent, this.eventList[oldEvent]);
            if (this.eventList.hasOwnProperty(oldEvent) && this.eventList[oldEvent] !== null) {
                window.removeEventListener(oldEvent, this.eventList[oldEvent]);
            }
        }
        this.eventList = {};
        //and set new
        this.state = state;
        let events = this.state.events;
        for (let event in events) {
            console.log("Add new handlers", event, events[event]);
            if (events.hasOwnProperty(event) && events[event] !== null) {
                this.eventList[event] = e => {
                    events[event].call(this.state, this, e);
                };
                window.addEventListener(event, this.eventList[event]);
            }
        }
    }
    getState() {
        return this.state;
    }
    update() {
        this.state.update(this.ctx);
    }
}

class State {
    constructor(){}
    get events() {
        return {};
    }
    update(context){

    }
}

class CreditsState extends State {
    constructor() {
        super();
    }
    keyHandler(scene, event) {
        scene.setState(menu );
        scene.update();
    }
    get events() {
        return {
            keyup: this.keyHandler,
        }
    }
    update(context){
        context.clearRect(0, 0, 960, 600);
        context.fillStyle = "white";
        context.font = "48px manaspc";
        context.textAlign = "center";
        context.fillText("Credits", 470, 40);
        context.font = "36px manaspc";
        context.fillText("Press any key to continue...", 470, 580);

        context.textAlign = "left";
        context.font = "24px manaspc";

        context.fillText("Made by:", 10, 65);
        context.fillText("Balashenko Igor (DwarfMason)", 10, 100);
        context.fillText("Yury Kurlykov (t1meshift)", 10, 130);
        context.fillText("Andrey Osadchii (smgks)", 10, 160);
        super.update(context);
    }
}

class MenuState extends State {
    constructor() {
        super();
        this.menuPos = 0;
        this.menuImgs = menuImgs;
        this.menuStates = [game, leaderboards, settings, credits];

    }
    keyHandler(scene, event) {
        switch(event.keyCode) {
            case 38: //arrow up
                this.menuPos--;
                break;
            case 40: //arrow down
                this.menuPos++;
                break;
            case 13:
                if (this.menuStates[this.menuPos] !== null) {

                    switch (this.menuPos){
                        case 0:
                            scene.setState(charCreation);
                            // scene.setState(game);
                            // game.startGame();
                            break;
                        case 1:
                            alert("Not yet implemented!");
                            break;
                        case 2:
                            alert("Not yet implemented!");
                            break;
                        case 3:
                            scene.setState(credits);
                            break;
                    }
                } else {
                    alert("Not yet implemented!");
                }
                break;

        }
        scene.update();
    }
    get events() {
        return {
            keyup: this.keyHandler,
        }
    }
    update(context){
        context.fillStyle = "black";
        context.fillRect(0, 0, 1000, 650);

        console.log("menuPos", this.menuPos);
        if (this.menuPos < 0)
            this.menuPos = 3;
        if (this.menuPos > 3)
            this.menuPos = 0;
        console.log("menuPos", this.menuPos);
        context.drawImage(this.menuImgs[this.menuPos], 0, 0);
        super.update(context);
    }
}

class CharCreationState extends State {
    constructor() {
        super();
        this.isCreated = false;
    }
    keyHandler(scene, event) {
        switch (event.keyCode) {
            case 72: //h
                mainHero = new Player('human', 10, 10, 'brave hero');
                this.isCreated = true;
                break;
            case 79: //o
                mainHero = new Player('orc', 10, 10, 'badass orc');
                this.isCreated = true;
                break;
            case 77: //m
                mainHero = new Player('magic wombat', 10, 10, 'little cuty');
                this.isCreated = true;
                break;
            case 13: //Enter
                if (this.isCreated) {
                    scene.setState(game);
                    game.startGame();
                }
        }
        scene.update();
    }

    get events() {
        return {
            keyup: this.keyHandler,
        }
    }

    update(context) {
        context.clearRect(0, 0, 960, 600);
        context.fillStyle = "white";
        context.font = "48px manaspc";
        context.textAlign = "center";
        context.fillText("Choose your race:", 470, 40);
        context.font = "24px manaspc";
        context.fillText("Press the following button to choose your hero", 470, 580);
        context.fillText("Press Enter to play", 470, 600);

        context.textAlign = "left";
        context.font = "24px manaspc";

        context.fillText("h - human", 10, 100);
        context.fillText("o - orc", 10, 130);
        context.fillText("m - magic wombat", 10, 160);
        super.update(context);
        if (this.isCreated) {
            context.font = "16px manaspc";
            context.fillText(`Your character: ${mainHero.name}`, 650, 100);
            context.fillText(`Strength: ${mainHero.strength}`, 650,130);
            context.fillText(`Agility: ${mainHero.agility}`, 650,160);
            context.fillText(`Initiative: ${mainHero.initiative} `, 650,190);
            context.fillText(`Endurance: ${mainHero.endurance}`, 650,220);
        }
    }
}


class controller{
    constructor(player,map){
        this.player = player;
        this.map = map;
    }

    moveR(){
        if(this.map[this.player.y ][this.player.x + +1].isMovable){
            this.player.x++;
        }

    }
    moveL(){
        if(this.map[this.player.y][this.player.x - +1].isMovable){
            this.player.x--;
        }

    }
    moveD(){
        if(this.map[this.player.y + +1][this.player.x].isMovable){
            this.player.y++;
        }

    }
    moveU(){
        if(this.map[this.player.y - +1][this.player.x].isMovable){
            this.player.y--;
        }

    }
}

class GameState extends State {
    constructor(dialog = 0) {
        super();
        this.offsetX = 0;
        this.offsetY = 0;
        this.messages = this.messages = ["","","","","","","","",""];
        this.map = [[]];
        this.objectsMap = [];
//        this.rMenu = null;
        this.controller = null;
        this.ctx = null;
    }
    startGame(){
        let cave = dungeonGeneration.generateCave();
        this.map = cave[0];
        this.objectsMap = dungeonGeneration.generateObjects();
//        this.rMenu = this.objectsMap[0].rMenu;

        this.objectsMap[0].x = cave[1];
        this.objectsMap[0].y = cave[2];
        this.controller = new controller(this.objectsMap[0],this.map);
        this.pushMessage("game started");
    }

    SetNewMap(){
        this.map = dungeonGeneration.generateCave();
        this.objectsMap = dungeonGeneration.generateObjects();
    }
    pushMessage(text){
        this.messages[7] = this.messages[6];
        this.messages[6] = this.messages[5];
        this.messages[5] = this.messages[4];
        this.messages[4] = this.messages[3];
        this.messages[3] = this.messages[2];
        this.messages[2] = this.messages[1];
        this.messages[1] = this.messages[0];

        this.messages[0] = text;
        if(this.ctx !== null){this.update(this.ctx);}

        //alert(this.messages);
    }


    drowRMenu(context){
        context.fillStyle = "black";
        context.fillRect(0, 0, 1000, 650);
        context.fillStyle = 'white';
        context.fillRect(805,5,190,475);
        context.fillStyle = "black";
        context.fillRect(807,7,186,471);

        context.fillStyle = "white";
        context.font  = "24px manaspc";
        if(this.objectsMap[0] !== undefined){
            context.fillText(this.objectsMap[0].name, 815, 35);
            context.fillText("HP:" + this.objectsMap[0].hp + '/' + this.objectsMap[0].maxHP ,820,70);
            context.fillText("MP:" + this.objectsMap[0].mp + '/' + this.objectsMap[0].maxMP ,820,100);
            context.font  = "12px manaspc";

                context.fillText("-status:", 820, 120);
            for (let i = 0; i < this.objectsMap[0].baffs.length; ++i) {
                context.fillText(this.objectsMap[0].baffs[i], 820, 140 + (+20 * +i));
            }
        }


    }
    drowDMenu(context){
        context.fillStyle = 'white';
        context.fillRect(5,485,990,160);
        context.fillStyle = "black";
        context.fillRect(7,487,986,156);

        context.fillStyle = "white";
        context.font  = "18px manaspc";

        context.fillText(this.messages[0],10,505);      //0
        context.fillText(this.messages[1],10,525-1);      //1
        context.fillText(this.messages[2],10,545-2);      //2
        context.fillText(this.messages[3],10,565-3);      //3
        context.fillText(this.messages[4],10,585-4);      //4
        context.fillText(this.messages[5],10,605-5);      //5
        context.fillText(this.messages[6],10,625-5);      //6
        context.fillText(this.messages[7],10,645-7);      //7

    }

    clearScene(context) {
        //this.ctx.fillStyle = "black";
        context.clearRect(0, 0, context.width, context.height);
    }

    updateMap(context){
        for (let y = 0; y < this.map.length;++y){
            for (let x = 0; x < this.map[y].length;++x) {

                context.imageSmoothingEnabled= false;

                let ts = this.map[y][x].tileSet;
                context.drawImage(ts.image, ts.getTilePos(this.map[y][x].id), 0, +ts.tileSize, +ts.tileSize,
                    x * +   this.map[y][x].size, y * +this.map[y][x].size, +this.map[y][x].size, +this.map[y][x].size);

            }
        }
        for (let i = 0; i< this.objectsMap.length;++i){
            let ts = this.objectsMap[i].tileSet;
            context.drawImage(ts.image, ts.getTilePos(this.objectsMap[i].id), 0, +ts.tileSize, +ts.tileSize,
                this.objectsMap[i].x * +this.objectsMap[i].size, this.objectsMap[i].y * +this.objectsMap[i].size, +this.objectsMap[i].size, +this.objectsMap[i].size);
        }
        //alert(this.map);
    }

    update(context){
        this.ctx = context;
        super.update(context);
        this.clearScene(context);

        this.drowRMenu(context);
        this.drowDMenu(context);
        this.updateMap(context);
    }

    keyHandler(scene, event) {
        switch(event.keyCode) {
            case 38: //arrow up
                this.controller.moveU();
                break;
            case 40: //arrow down
                this.controller.moveD();
                break;
            case 37://arrow left
                this.controller.moveL();
                break;
            case 39://arrow r
                this.controller.moveR();
                break;
        }
        this.update(this.ctx);
    }

    get events() {
        return {
            keyup: this.keyHandler,
        }
    }
}
