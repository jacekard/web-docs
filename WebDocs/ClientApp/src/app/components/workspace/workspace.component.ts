import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from 'src/app/services/signal-r.service';
import { Cursor } from 'src/app/interfaces/cursor';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import { DocumentsService } from 'src/app/services/documents.service';
import { WebDocument } from 'src/app/interfaces/webDocument';
import * as $ from 'jquery';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  // @ViewChild('document', { static: false }) private documentRef: ElementRef;
  // @ViewChild('page', {static: false}) private pageRef: ElementRef;

  document: WebDocument;
  title: string;

  constructor(
    private signalR: SignalRService,
    private route: ActivatedRoute,
    private router: Router,
    private docsService: DocumentsService) { }

  // myCursor: Cursor;
  // cursors: Cursor[];
  // cursorHtml: string;

  ngOnInit() {
    this.initWorkspace();
    this.initCkeEditor();
    // this.cursors = new Array<Cursor>();
    // this.myCursor = { userId: 0, positionX: 0, positionY: 0, offsetLeft: 0, offsetTop: 0 };
    this.registerConnections();
  }

  initWorkspace() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id == null) {
      this.docsService.createNewDocument()
      .then(p => p
        .subscribe((doc) => {
          this.document = doc;
        }));
    }
    else {
      this.docsService.getDocument(parseInt(id))
      .then(p => p
        .subscribe((doc) => {
          this.document = doc;
          this.title = this.document.name;
          (<any>window).editor.setData(this.document.content);
        }));
    }
  }

  registerConnections() {
    this.signalR.registerHandler("ReceiveDocumentContent", (content: string) => {
      this.document.content = content;
      (<any>window).editor.setData(content);
    })

    // TODO: 
    // this.signalR.registerHandler("updateCursorPosition", (cursor: Cursor) => {
    //   // var offsetLeft = this.documentRef.nativeElement.offsetLeft;
    //   // var offsetTop = this.documentRef.nativeElement.offsetTop;
    //   // console.log({offsetLeft, offsetTop});
    //   // cursor.positionX += offsetLeft;
    //   // cursor.positionY += offsetTop;

    //   // console.log(cursor);
    //   // this.showCursors(cursor);
    // })
  }

  initCkeEditor() {
    var editor = BalloonEditor
    .create( document.querySelector( '#editor' ) )
    .then( editor => {
        (<any>window).editor = editor;
    } )
    .catch( err => {
        console.error( err.stack );
    } );
  }

  onKeydown(event) {
    this.updateDocument();

    // TODO: add cursor positioning
  }

  updateDocument() {
    this.document.content = (<any>window).editor.getData();
    this.document.name = this.title;
    this.signalR.send("updateDocumentContent", this.document);
  }

  /* TODO: */
  
  // showCursors(cursor: Cursor) {
  //   this.cursors.push(cursor);
  // }
  
  /*
  sendCursorPosition(event) {
    var yOffset = 15;
    var offsetLeft = this.documentRef.nativeElement.offsetLeft;
    var offsetTop = this.documentRef.nativeElement.offsetTop;

    var x = event.pageX - offsetLeft;
    var y = event.pageY - offsetTop - yOffset;
    this.myCursor = { 
      userId: 0, 
      positionX: x, 
      positionY: y, 
      offsetLeft: offsetLeft, 
      offsetTop: offsetTop
    };

    console.log(this.myCursor);
    this.signalR.send("pingCursorPosition", this.myCursor);
  } */

  @HostListener('window:scroll')
  onWindowScroll() {
    this.animateScrollTop();
  }

  onPageUp() {
    $('html').animate({ scrollTop: 0 }, {
      duration: 400,
      queue: false,
    }, "swing");
  }

  animateScrollTop() {
    const scrollTop = $('.scroll-btn');
    const windowOffset = window.pageYOffset;
    const targetScaleInClass = windowOffset > 100 ? true : false;

    if (!targetScaleInClass) {
      scrollTop.addClass('scale-in');
    }

    if (targetScaleInClass) {
      scrollTop.removeClass('scale-in');
    }
  }

  redirect() {
    this.router.navigateByUrl(`/documents`);
  }
}