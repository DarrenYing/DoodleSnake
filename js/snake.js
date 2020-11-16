var main = document.getElementById("main");
var showGrid = false;

/**
 * 构建地图对象
 * @param {Object} atom_len 单元格边长
 * @param {Object} rows		地图行数
 * @param {Object} cols		地图列数
 */
function Map(atom_len, rows, cols) {
	this.atom_len = atom_len;
	this.rows = rows;
	this.cols = cols;
	
	this.canvas = null;
	
	// 创建画布
	this.createCanvas = function(){
		this.canvas = document.createElement("div");
		this.canvas.style.cssText = "position: relative;top: 40px;border: 1px solid red;background: #FAFAFA;";
		this.canvas.style.width = this.atom_len * this.cols + 'px';
		this.canvas.style.height = this.atom_len * this.rows + 'px';
		main.appendChild(this.canvas);
		
		if(showGrid){
			for(var y=0; y<rows; y++) {
				for(var x=0; x<cols; x++) {
					var grid = document.createElement("div");
					grid.style.cssText = "border: 1px solid blue;";
					grid.style.width = this.atom_len + 'px';
					grid.style.height = this.atom_len + 'px';
					grid.style.backgroundColor = 'lightgrey';
					grid.style.position = 'absolute';
					grid.style.left = x*this.atom_len+'px';
					grid.style.top = y*this.atom_len+'px';
					this.canvas.appendChild(grid);
				}
			}
		}
	}
	
}

/**
 * 食物对象
 * @param {Object} map 地图
 */
function Food(map) {
	this.width = map.atom_len;
	this.height = map.atom_len;
	this.bgcolor = "rgb(120, 120, 150)";
	
	this.x = Math.floor(Math.random()*map.cols);
	this.y = Math.floor(Math.random()*map.rows);
	
	this.food = document.createElement('div');
	this.food.style.width = this.width+'px';
	this.food.style.height = this.height+'px';
	
	this.food.style.backgroundColor = this.bgcolor;
	this.food.style.position = 'absolute';
	this.food.style.left = this.x*this.width+'px';
	this.food.style.top = this.y*this.height+'px';
	
	map.canvas.appendChild(this.food);
}

/**
 * 贪吃蛇
 * @param {Object} map 地图
 */
function Snake(map) {
	this.width = map.atom_len;
	this.height = map.atom_len;
	this.direction = 'right';
	
	this.body = [
		{x:2, y:0},	//头部
		{x:1, y:0},	//身体
		{x:0, y:0},	//尾部
	];
	
	this.display = function() {
		for(var i=0; i<this.body.length; i++){
			if(this.body[i].x != null) {
				var part = document.createElement('div');
				// 将节点保存到一个状态变量中，以便之后删除使用
				this.body[i].flag = part;
				
				//设置蛇的样式
				part.style.width = this.width+'px';
				part.style.height = this.height+'px';
				part.style.backgroundColor = "yellow";
				
				//设置位置
				part.style.position = 'absolute';
				part.style.left = this.body[i].x*this.width+'px';
				part.style.top = this.body[i].y*this.height+'px';
				
				map.canvas.appendChild(part);
			}
		}
		document.getElementById("snakenum").innerHTML = this.body.length;
	}
	
	this.run = function() {
		for(var i=this.body.length-1; i>0; i--) {
			this.body[i].x = this.body[i-1].x;
			this.body[i].y = this.body[i-1].y;
		}
		
		//根据方向处理蛇头
		switch(this.direction) {
			case 'left': this.body[0].x -= 1; break;
			case 'right': this.body[0].x += 1; break;
			case 'up': this.body[0].y -= 1; break;
			case 'down': this.body[0].y += 1; break;
		}
		
		//判断蛇头吃到食物
		if(this.body[0].x == food.x && this.body[0].y == food.y) {
			this.body.push({x:null, y:null, flag:null});
			
			//判断是否升级
			if(this.body.length >= level.pass_length){
				level.levelup();
			}
			
			map.canvas.removeChild(food.food);	//删除被吃掉的食物
			food = new Food(map);	//创建新食物
		}
		
		//判断蛇头是否出界
		if(this.body[0].x<0 || this.body[0].x>map.cols-1 || this.body[0].y<0 || this.body[0].y>map.rows-1) {
			clearInterval(timer);
			alert("Game Over!");
			
			// 重新开始游戏
			restart(map, this);
			
			return false;
		}
		
		//判断是否撞到自己
		for(var i=4; i<this.body.length; i++) {
			if(this.body[i].x == this.body[0].x && this.body[i].y == this.body[0].y) {
				clearInterval(timer);
				alert("Game Over!");
				
				// 重新开始游戏
				restart(map, this);
				
				return false;
			}
		}
		
		
		
		
		//删除原来的身体
		for(var i=0; i<this.body.length; i++){
			if(this.body[i].flag != null) {
				map.canvas.removeChild(this.body[i].flag);
			}
		}
		
		this.display();
	}
}

function Level() {
	this.num = 1;
	this.speed = 300;	//刷新速度，即移动速度
	this.pass_length = 6;	//通关蛇长
	
	this.levelup = function() {
		this.num++;
		if(this.speed <= 50) {
			this.speed = 50;
		}else {
			this.speed -= 50;
		}
		
		this.pass_length += (6+this.num);
		
		this.display();
		start();
	}
	
	this.display = function() {
		document.getElementById("stagenum").innerHTML = this.num;
	}
	
	
}

var level = new Level();
level.display();

var map = new Map(20, 30, 30);
map.createCanvas();

var food = new Food(map);

var snake = new Snake(map);
snake.display(map);

//键盘处理事件
window.onkeydown = function(e) {
	var event = e || window.event;
	
	switch(event.keyCode) {
		case 38:
			if(snake.direction != "down"){
				snake.direction = "up";
			}
			break;
		case 40:
			if(snake.direction != "up"){
				snake.direction = "down";
			}
			break;
		case 37:
			if(snake.direction != "right"){
				snake.direction = "left";
			}
			break;
		case 39:
			if(snake.direction != "left"){
				snake.direction = "right";
			}
			break;
	}
}

function restart(map, snake) {
	for(var i=0; i<snake.body.length; i++) {
		map.canvas.removeChild(snake.body[i].flag);
	}
	
	snake.direction = 'right';
	snake.body = [
		{x:2, y:0},	//头部
		{x:1, y:0},	//身体
		{x:0, y:0},	//尾部
	];
	snake.display();
	
	map.canvas.removeChild(food.food);
	food = new Food(map);
	
	level.num = 1;
	level.speed = 300;	//刷新速度，即移动速度
	level.pass_length = 8;	//通关蛇长
	level.display();
	
}

// 开始游戏和暂停游戏
var timer;

function start() {
	clearInterval(timer);
	timer = setInterval(function(){
		snake.run();
	}, level.speed);
}

document.getElementById("begin").onclick = function(){
	start();
}

document.getElementById("pause").onclick = function(){
	clearInterval(timer);
}