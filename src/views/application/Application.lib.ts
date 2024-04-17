export class Application {
  container: HTMLDivElement = document.createElement('div');
  canvas: HTMLCanvasElement = document.createElement('canvas');
  context: CanvasRenderingContext2D | null = this.canvas.getContext('2d');

  loading = true;
  isUninstalled = false;
  FPS = 24;
  FRAME = 0;
  frame = -1;
  time: null | number = null;

  width: number = 100;
  height: number = 100;
  padding = 300;
  path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  svg: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  points: DOMPoint[] = [];
  pointIndex: number = 0;
  distancePerPoint = 1;
  span = 2;
  scale = 1;
  x = this.padding;
  y = this.padding;
  timer: ReturnType<typeof setTimeout> = 0;
  animationTime = 6; // sec;
  fillStyle: string = 'rgb(231,225,219)';
  strokeStyle: string = 'rgb(25,25,25)';
  lineWidth: number = 1;
  format = 'video/webm;codecs:h265';
  name = 'video.webm';

  public init(container: HTMLDivElement, width: number, height: number, gridSize: number = 1) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.setSize(width, height, gridSize, true);
    this.container.appendChild<HTMLCanvasElement>(this.canvas);
    this.svg.appendChild<SVGPathElement>(this.path);
    this.svg.style.opacity = '0';
    this.svg.style.zIndex = '-1';
    this.svg.style.position = 'absolute';
    this.container.appendChild<SVGElement>(this.svg);
  }

  private update() {
    if (this.loading || !this.context) return true;
    if (this.isUninstalled) return false;
    this.FRAME = (this.FRAME + 1) % this.FPS;
    this.draw();
    return true;
  }

  public loop = (timestamp: number) => {
    const delay = 1000 / this.FPS;
    if (this.time === null) this.time = timestamp; // init start time
    const seg = Math.floor((timestamp - this.time) / delay); // calc frame no.
    if (seg > this.frame) {
      this.frame = seg; // update
      this.update();
    }
    const id = requestAnimationFrame(this.loop);
    if (this.isUninstalled) {
      cancelAnimationFrame(id);
    }
  };

  public uninstall() {
    if (this.container.hasChildNodes()) this.container.removeChild<HTMLCanvasElement>(this.canvas);
    if (this.container.hasChildNodes()) this.container.removeChild<SVGElement>(this.svg);
    this.container.innerText = '';
    this.loading = true;
    console.log('Uninstalled!');
  }

  // -------------------------------------------------------------------------

  public set(params: {
    path: string;
    time: number;
    background: string;
    color: string;
    lineWidth: number;
  }) {
    // update the SVG path for getBox()
    this.path.setAttribute('d', params.path);
    this.setTiming(params.time || 6);
    this.fillStyle = params.background;
    this.strokeStyle = params.color;
    this.lineWidth = params.lineWidth;

    // calculate the scale value
    const { width: w = this.width, height: h = this.height } = this.path.getBBox();
    this.scale =
      Math.min((this.width - this.padding * 2) / w, (this.height - this.padding * 2) / h) || 1;
    this.x = (this.width - w * this.scale) / 2;
    this.y = (this.height - h * this.scale) / 2;
    console.log('INIT', { w, h, scale: this.scale, x: this.width, y: this.height });

    this.pointsCalculation();
    this.pointIndex = 0;

    if (!this.context) return;
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
    this.context.beginPath();
    this.context.moveTo(this.points[this.pointIndex].x, this.points[this.pointIndex].y);

    this.loading = false;
  }

  /**
   *
   * @param time second
   */
  private setTiming(time: number) {
    this.animationTime = time;
    const totalPoints = this.path.getTotalLength() / this.distancePerPoint;
    const totalFrame = this.FPS * this.animationTime;
    this.span = Math.ceil(totalPoints / totalFrame);
  }

  private draw() {
    if (!this.context) return;
    this.liner();
  }

  private pointsCalculation = () => {
    this.points = [];
    let nextPoint = this.points.length * this.distancePerPoint;
    const pathLength = this.path.getTotalLength();
    while (nextPoint < pathLength) {
      const point = this.path.getPointAtLength(nextPoint);
      point.x = point.x * this.scale + this.x;
      point.y = point.y * this.scale + this.y;
      this.points.push(point);
      nextPoint = this.points.length * this.distancePerPoint;
    }
  };

  private liner() {
    if (!this.context) return;
    const spanIndex = this.pointIndex + this.span;
    for (let i = this.pointIndex; i < spanIndex; i++) {
      if (i < this.points.length) this.context.lineTo(this.points[i].x, this.points[i].y);
      this.pointIndex += 1;
    }
    this.context.stroke();
  }

  private setSize(width: number, height: number, gridSize: number, flex: boolean) {
    const dpi = window.devicePixelRatio || 1;
    const w = width * dpi;
    const h = height * dpi;
    this.width = this.canvas.width = w - (w % gridSize);
    this.height = this.canvas.height = h - (h % gridSize);
    if (flex) {
      const { clientWidth, clientHeight } = this.container;
      const scale = Math.min(Math.min(clientWidth / width, clientHeight / height), 1);
      this.canvas.style.width = width * scale + 'px';
      this.canvas.style.height = height * scale + 'px';
      console.log(
        { clientWidth, clientHeight, scale },
        this.canvas.style.width,
        this.canvas.style.height,
      );
    } else {
      this.canvas.style.width = width + 'px';
      this.canvas.style.height = height + 'px';
    }
  }

  // ------------------------------------------------------------
  // PUBLIC METHODS
  // ------------------------------------------------------------

  public exportVideo(cb?: () => void) {
    if (!this.canvas) return;
    console.log('A ', this.animationTime + 'sec video exporting...');
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
    }, this.animationTime * 1000 + 500);
  }
}
