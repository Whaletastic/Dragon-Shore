class Controller{
    constructor(player, map, objects){
        this.player = player;
        this.map = map;
        this.objectsMap = objects;
    }

    useSpell(scene){
        let handler = mainHero.magic.useSpell();
        scene.update();
        return handler;
    }

    checkCollision(scene){
        for (let i = 1;i < this.objectsMap.length && !mainHero.isDead; ++i) {
            if((this.player.x === this.objectsMap[i].x) && (this.player.y === this.objectsMap[i].y)){
                if(!this.objectsMap[i].isDead){
                    if (mainHero.initiative >= this.objectsMap[i].initiative)
                        closeBattle(this.player, this.objectsMap[i]);
                    else
                        closeBattle(this.objectsMap[i], this.player);
                    if(this.player.isDead){
                        scene.setState(gameOver);
                        // Post score if user is authorized
                        postScore(depth).then(value => {
                            console.warn("Score posted:", value);
                        });
                        scene.update();
                    }
                    if(this.player.isDead)
                        scene.setState(gameOver);
                    return 1;
                }
            }
        }
        return 0;
    }
    enter(){
        if(this.map[this.player.y][this.player.x] instanceof EndPoint){
            game.newLevel();
        }
    }
    moveR(scene){
        if(this.map[this.player.y][this.player.x + 1].isMovable){
            this.player.x++;
            if(this.checkCollision(scene)){
                this.player.x--;
            }
        }
        else {

        }

    }
    moveL(scene){
        if(this.map[this.player.y][this.player.x - 1].isMovable){
            this.player.x--;
            if(this.checkCollision(scene)){
                this.player.x++;
            }
        }
        else {

        }

    }
    moveD(scene){
        if(this.map[this.player.y + 1][this.player.x].isMovable){
            this.player.y++;
            if(this.checkCollision(scene)){
                this.player.y--;
            }
        }
        else {

        }

    }
    moveU(scene){
        if(this.map[this.player.y - 1][this.player.x].isMovable){
            this.player.y--;

            if(this.checkCollision(scene)){
                this.player.y++;
            }
        }
        else {

        }
    }

    drinkHP(){
        if (mainHero.hpPotions != 0 && mainHero.hp != mainHero.maxHP) {
            if (rollDice(20,1) < 3){
                game.pushMessage('(You accidentally spilled your potion){red}');
            }else {
                mainHero.hp += 3;
                mainHero.hp = Math.min(mainHero.hp, mainHero.maxHP);
                game.pushMessage('(You drink health potion){green}');
            }
            mainHero.hpPotions--;
        }
    }
    drinkMP(){
        if (mainHero.mpPotions != 0 && mainHero.mp != mainHero.maxMP) {
            if (rollDice(20,1) < 3){
                game.pushMessage('(You accidentally spilled your potion){red}');
            }else {
                mainHero.mp += 3;
                mainHero.mp = Math.min(mainHero.mp, mainHero.maxMP);
                game.pushMessage('(You drink mana potion){green}');
            }
            mainHero.mpPotions--;
        }
    }
}



class MobController{
    constructor(map,objectsMap){
        this.map = map;
        this.objectsMap = objectsMap;
    }
    move(scene){
        for (let i = 1;i < this.objectsMap.length;++i){
            let lastPos = this.objectsMap[i].move(this.map);
            if(this.checkPlayerCollision(scene)){
                this.objectsMap[i].x = lastPos[0];
                this.objectsMap[i].y = lastPos[1];
            }

        }
    }
    checkPlayerCollision(scene){
        for (let i = 1;i < this.objectsMap.length && !mainHero.isDead; ++i) {
            if((this.objectsMap[0].x === this.objectsMap[i].x) && (this.objectsMap[0].y === this.objectsMap[i].y)){
                if(!this.objectsMap[i].isDead){
                    if (mainHero.initiative >= this.objectsMap[i].initiative)
                        closeBattle(this.objectsMap[0], this.objectsMap[i]);
                    else
                        closeBattle(this.objectsMap[i], this.objectsMap[0]);
                    if(this.objectsMap[0].isDead){
                        scene.setState(gameOver);
                        // Post score if user is authorized
                        postScore(depth).then(value => {
                            console.warn("Score posted:", value);
                        });
                        scene.update();
                    }
                    return 1;
                }
            }
            for (let j = 1; j < this.objectsMap.length ;++j){
                if (j == i)
                    continue;
                if((this.objectsMap[j].x === this.objectsMap[i].x) && (this.objectsMap[j].y === this.objectsMap[i].y)){
                    if(!this.objectsMap[i].isDead){
                        mobCloseBattle(this.objectsMap[j], this.objectsMap[i],0);
                        console.log("mob battle");
                    }
                }
            }
        }
        return 0;
    }
}