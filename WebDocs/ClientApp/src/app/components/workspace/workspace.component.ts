import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from 'src/app/services/signal-r.service';
import { Cursor } from 'src/app/interfaces/cursor';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import { WebDocument } from 'src/app/interfaces/webDocument';
import { DocumentsService } from 'src/app/services/documents.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  @ViewChild('document', { static: false }) private documentRef: ElementRef;
  @ViewChild('page', {static: false}) private pageRef: ElementRef;

  constructor(
    private signalR: SignalRService,
    private route: ActivatedRoute,
    private docsService: DocumentsService) { }

  timeoutBeforeUpdateInMs = 20;
  loadedContent: string;
  myCursor: Cursor;
  cursors: Cursor[];
  cursorHtml: string;
  document: WebDocument;

  ngOnInit() {
    this.initWorkspace();
    this.initCkeEditor();
    this.cursors = new Array<Cursor>();
    this.myCursor = { userId: 0, positionX: 0, positionY: 0, offsetLeft: 0, offsetTop: 0 };
    this.registerConnections();
  }

  initWorkspace() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id == null || id == '#') {
      console.log("new doc");
    }
    else {
      this.docsService.getDocument(id).subscribe((doc) => this.document = doc);
    }
  }

  registerConnections() {
    this.signalR.registerHandler("docsModified", (username: string, message: string) => {
      console.log(username, message);
    })
    this.signalR.registerHandler("ReceiveDocumentContent", (content: string) => {
      console.log(content);
      (<any>window).editor.setData(content);
    })
    this.signalR.registerHandler("updateCursorPosition", (cursor: Cursor) => {
      // var offsetLeft = this.documentRef.nativeElement.offsetLeft;
      // var offsetTop = this.documentRef.nativeElement.offsetTop;
      // console.log({offsetLeft, offsetTop});
      // cursor.positionX += offsetLeft;
      // cursor.positionY += offsetTop;

      // console.log(cursor);
      // this.showCursors(cursor);
    })
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

  showCursors(cursor: Cursor) {
    this.cursors.push(cursor);
  }

  onKeydown(event) {
    // TODO: change to 'Document' interface later.
    setTimeout(() => {
      this.signalR.send("updateDocumentContent", this.pageRef.nativeElement.outerHTML);
    }, this.timeoutBeforeUpdateInMs);

    //this.signalR.send("pingCursorPosition", this.myCursor);
  }

  updateDocument() {
    // TODO: change to 'Document' interface later.
    setTimeout(() => {
      this.signalR.send("updateDocumentContent", (<any>window).editor.getData());
    }, this.timeoutBeforeUpdateInMs);
  }

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
  }
}