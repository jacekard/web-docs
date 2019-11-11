import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from 'src/app/services/signal-r.service';
import { DrawingData } from 'src/app/interfaces/drawing-data';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('linkSaveImage', { static: true })
  linkSaveImage: ElementRef<any>;

  @Input() public width = window.innerWidth - window.innerWidth / 4;
  @Input() public height = window.innerHeight - window.innerHeight / 4;

  private uuid: any;
  private title: string;
  private ctx: CanvasRenderingContext2D;
  brushSize: number = 1;
  brushColor: string = '#000';

  constructor(
    private signalR: SignalRService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SnackBarService) { }

  ngOnInit() {
    this.initWorkspace();
    this.registerConnections();
    setTimeout(() => {
      this.AddToDocumentGroup();
    }, 1000);
  }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.ctx.lineCap = 'round';
    this.ctx.imageSmoothingEnabled = true;
    this.changeColor();
    this.captureEvents(canvasEl);
  }

  changeBrushSize(size: number = this.brushSize) {
    this.ctx.lineWidth = size;
  }

  changeColor(color: string = this.brushColor) {
    this.ctx.strokeStyle = color;
  }

  AddToDocumentGroup() {
    this.signalR.send("AddToDrawingGroup", this.uuid);
  }

  RemoveFromDocumentGroup() {
    this.signalR.send("RemoveFromDrawingGroup", this.uuid);
  }

  ngOnDestroy() {
    this.RemoveFromDocumentGroup();
  }

  initWorkspace() {
    this.uuid = this.route.snapshot.paramMap.get('uuid');
  }

  registerConnections() {
    this.signalR.registerHandler("DrawFromHub", (data: DrawingData) => {
      if (this.ctx) {
        this.drawOnCanvas(data);
      }
      else {
        this.snackBar.open("Canvas context not initialized", 3000);
      }
    });

    this.signalR.registerHandler("EditorAdded", () => {
      this.snackBar.open(`You are now sharing this document with others.`);
    });

    this.signalR.registerHandler("EditorRemoved", () => {
      this.snackBar.open(`You are now sharing this document with others.`);
    })
  }

  sendDrawing(data: DrawingData) {
    console.log(data);

    this.signalR.send("Draw", data);
  }

  saveImage() {
    var link = this.linkSaveImage.nativeElement;
    if (this.title) {
      link.setAttribute('download', `${this.title}.png`);
    } else {
      link.setAttribute('download', `Untitled.png`);
    }
    console.log(link);
    link.setAttribute('href', this.canvas.nativeElement.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event    
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current positions with the offset
        var data: DrawingData = {
          previousX: res[0].clientX - rect.left,
          previousY: res[0].clientY - rect.top,
          currentX: res[1].clientX - rect.left,
          currentY: res[1].clientY - rect.top,
          color: this.brushColor,
          size: this.brushSize
        };

        this.drawOnCanvas(data);
        this.sendDrawing(data);
      });
  }

  private drawOnCanvas(data: DrawingData) {
    if (!this.ctx) { return; }

    this.changeBrushSize(data.size)
    this.changeColor(data.color);
    this.ctx.beginPath();

    if (data.previousX && data.previousY) {
      this.ctx.moveTo(data.previousX, data.previousY); // from
      this.ctx.lineTo(data.currentX, data.currentY);
      this.ctx.stroke();
    }
  }

  redirect() {
    this.router.navigateByUrl(`/documents`);
  }
}
