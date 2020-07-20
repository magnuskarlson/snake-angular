import { Component, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css']
})
export class SnakeComponent implements OnInit {
  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  keys: string[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  width: number;
  height: number;
  delta = 10;
  cubes = [];
  food = [];
  points = 0;

  constructor() { }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if(this.keys.includes(event.key)){
      if(event.key == 'ArrowRight')this.moveCube(this.delta, 0);
      if(event.key == 'ArrowLeft')this.moveCube(-this.delta, 0);
      if(event.key == 'ArrowUp')this.moveCube(0, -this.delta);
      if(event.key == 'ArrowDown')this.moveCube(0, this.delta);
    }
  }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.width = this.canvas.nativeElement.width;
    this.height = this.canvas.nativeElement.height;
    for(let i = 1; i >= 0; i--){
      this.cubes.push([i * this.delta, 0]);
    }
    this.genFood();
    this.drawCubes();
  }

  clear(){
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  moveCube(x, y){
    let posX = this.cubes[0][0] + x, posY = this.cubes[0][1] + y;
    if(posX < 0 || posX >= this.width || posY < 0 || posY >= this.height)return;
    let last = [...this.cubes[0]], pos = [];
    if(this.cubes.some(e => e[0] == this.cubes[0][0] + x && e[1] == this.cubes[0][1] + y))return;

    this.cubes.forEach((e,i) => {
      if(i == 0){
        e[0] += x;
        e[1] += y;
      }else{
        pos = [...e];
        e[0] = last[0];
        e[1] = last[1];
        last = [...pos];
      }
    });

    if(this.food[0] == this.cubes[0][0] && this.food[1] == this.cubes[0][1]){
      this.points += 1;
      this.cubes.push([...last]);
      this.genFood();
    }

    this.drawCubes();
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  genFood(){
    this.food = [this.getRandomInt(0, this.width / this.delta) * this.delta, this.getRandomInt(0, this.height/this.delta) * this.delta];
  }

  drawCubes(){
    this.clear();
    this.cubes.forEach((e, i) => {
      this.drawCube(e[0], e[1], i == 0 ? 'red' : 'black');
    });

    this.drawCube(this.food[0], this.food[1], 'green');
  }

  drawCube(x, y, color){
    this.ctx.beginPath();
    this.ctx.rect(x, y, this.delta, this.delta);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
}
