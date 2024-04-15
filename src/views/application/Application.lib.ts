// import type { Coordinates, EventMap, Events } from '@/views/application/Application.types.ts';

export class Application {
  container: HTMLDivElement = document.createElement('div');
  canvas: HTMLCanvasElement = document.createElement('canvas');
  context: CanvasRenderingContext2D | null = this.canvas.getContext('2d');
  // mouseDown: boolean = false;
  width: number = 100;
  height: number = 100;
  padding = 300;
  path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  svg: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  points: DOMPoint[] = [];
  distancePerPoint = 1;
  drawFPS = 60;
  scale = 1;
  x = this.padding;
  y = this.padding;
  timer: ReturnType<typeof setTimeout> = 0;
  time = 6000;
  fillStyle: string = 'rgb(231,225,219)';
  strokeStyle: string = 'rgb(25,25,25)';
  lineWidth: number = 1;
  format = 'video/webm;codecs:h265';
  name = 'video.webm';

  init(container: HTMLDivElement, width: number, height: number, gridSize: number = 50) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.setSize(width, height, gridSize);
    this.container.appendChild<HTMLCanvasElement>(this.canvas);
    // this.path.style.display = 'none';
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.appendChild<SVGPathElement>(this.path);
    this.svg.style.visibility = 'hidden';
    this.svg.style.position = 'absolute';
    this.container.appendChild<SVGElement>(this.svg);
    const { width: w = this.width, height: h = this.height } = this.path.getBoundingClientRect();
    this.scale = Math.min(
      (this.width - this.padding * 2) / w,
      (this.height - this.padding * 2) / h,
    );
    this.x = (this.width - w * this.scale) / 2;
    this.y = (this.height - h * this.scale) / 2;
    console.log('INIT', { w, h, scale: this.scale, path: this.path.getBoundingClientRect() });
  }

  public remove() {
    console.log('TIMER', this.timer);
    if (this.timer as unknown as number) clearInterval(this.timer);
    this.container.removeChild<HTMLCanvasElement>(this.canvas);
    this.container.removeChild<SVGElement>(this.svg);
    this.container.innerText = '';
  }

  public set(params: {
    path: string;
    time: number;
    background: string;
    color: string;
    lineWidth: number;
  }) {
    this.path.setAttribute('d', params.path);
    this.setTime(params.time || 6);
    this.fillStyle = params.background;
    this.strokeStyle = params.color;
    this.lineWidth = params.lineWidth;
  }

  /**
   *
   * @param t ms
   */
  public setTime(t: number) {
    const totalPoints = this.path.getTotalLength() / this.distancePerPoint;
    this.drawFPS = totalPoints / t;
    this.time = (totalPoints * 1000) / this.drawFPS;
    console.log({ time: this.time, fps: this.drawFPS, totalPoints });
    // this.path.setAttribute('transform', 'scale(2)');
  }

  public draw() {
    if (!this.context) return;
    console.log('DRAWING');
    this.points = [];
    this.context?.clearRect(0, 0, this.width, this.height);
    this.context.save();
    this.context.fillStyle = this.fillStyle;
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.restore();
    this.context.lineWidth = this.lineWidth;
    this.context.strokeStyle = this.strokeStyle;
    this.context.shadowColor = this.strokeStyle;
    this.context.shadowBlur = 1.5;
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;
    clearInterval(this.timer);
    this.timer = setInterval(this.getPoints, 1000 / this.drawFPS);
  }

  private getPoints = () => {
    const nextPoint = this.points.length * this.distancePerPoint;
    const pathLength = this.path.getTotalLength();
    if (nextPoint <= pathLength) {
      const point = this.path.getPointAtLength(nextPoint);
      point.x = point.x * this.scale + this.x;
      point.y = point.y * this.scale + this.y;
      this.points.push(point);
      this.redrawCanvas();
    }
  };

  private redrawCanvas() {
    if (!this.context) return;
    this.context.beginPath();
    this.context.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      this.context.lineTo(this.points[i].x, this.points[i].y);
    }
    this.context.stroke();
  }

  private setSize(width: number, height: number, gridSize: number) {
    const dpi = window.devicePixelRatio || 1;
    const w = width * dpi;
    const h = height * dpi;
    this.width = this.canvas.width = w - (w % gridSize);
    this.height = this.canvas.height = h - (h % gridSize);
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
  }

  // ------------------------------------------------------------
  // PUBLIC METHODS
  // ------------------------------------------------------------

  public exportVideo(cb?: () => void) {
    if (!this.canvas) return;
    this.draw();
    const n: Blob[] = [];
    const stream = this.canvas.captureStream(25);
    const media = new MediaRecorder(stream, { mimeType: this.format });
    media.ondataavailable = function (e) {
      e.data && e.data.size > 0 && n.push(e.data);
    };
    media.onstop = () => {
      const blob = new Blob(n, { type: this.format });
      const href = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = href;
      a.download = this.name;
      console.log(href, a);
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(href);
      }, 100);
    };
    media.start(100);
    setTimeout(() => {
      // stream.remove();
      media.stop();
      if (cb) cb();
    }, this.time);
  }
}
