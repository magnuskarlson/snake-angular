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
  delta = 25;
  cubes = [];

  constructor() { }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if(this.keys.includes(event.key)){
      if(event.key == 'ArrowRight')this.moveCube(1, 0);
      if(event.key == 'ArrowLeft')this.moveCube(-1, 0);
      if(event.key == 'ArrowUp')this.moveCube(0, -1);
      if(event.key == 'ArrowDown')this.moveCube(0, 1);
    }
  }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.width = this.canvas.nativeElement.width;
    this.height = this.canvas.nativeElement.height;
    for(let i = 9; i >= 0; i--){
      this.cubes.push([i, 0]);
    }
    this.drawCubes();
  }

  clear(){
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  moveCube(x, y){
    let posX = (this.cubes[0][0] + x) * this.delta, posY = (this.cubes[0][1] + y) * this.delta;
    if(posX < 0 || posX >= this.width || posY < 0 || posY >= this.height)return;
    let last = [...this.cubes[0]], pos = [];
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
    this.drawCubes();
  }

  drawCubes(){
    this.clear();
    this.cubes.forEach((e, i) => {
      this.drawCube(e[0], e[1], i == 0 ? 'red' : 'black');
    })
  }

  drawCube(x, y, color){
    this.ctx.beginPath();
    this.ctx.rect(x * this.delta, y * this.delta, this.delta, this.delta);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
}
