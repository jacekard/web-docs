import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from 'src/app/services/signal-r.service';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { DocumentsService } from 'src/app/services/documents.service';
import { WebDocument } from 'src/app/interfaces/web-document';
import * as $ from 'jquery';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  document: WebDocument;
  title: string;
  processing: Boolean = false;

  constructor(
    private signalR: SignalRService,
    private route: ActivatedRoute,
    private router: Router,
    private docsService: DocumentsService,
    private snackBar: SnackBarService) { }

  ngOnInit() {
    this.initWorkspace();
    this.initCkeEditor();
    this.registerConnections();
    setTimeout(() => {
      this.AddToDocumentGroup();
    }, 1000);
  }

  ngOnDestroy() {
    this.saveDocument();
    this.RemoveFromDocumentGroup();
  }

  initWorkspace() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id == null) {

    }
    else {
      this.docsService.getDocument(parseInt(id))
      .then(p => p
        .subscribe((doc) => {
          this.document = doc;
          this.title = this.document.name;
          if (this.document.content !== null) {
            (<any>window).editor.setData(this.document.content);
          }
        }));
    }
  }

  registerConnections() {
    this.signalR.registerHandler("ReceiveDocumentContent", (content: string) => {
      this.document.content = content;
      (<any>window).editor.setData(content);
    });

    this.signalR.registerHandler("EditorAdded", () => {
      this.snackBar.open(`You are now sharing this document with others.`);
    });

    this.signalR.registerHandler("EditorRemoved", () => {
      this.snackBar.open(`Editor has left.`);
    })
  }

  AddToDocumentGroup() {
    this.signalR.send("AddToDocumentGroup", this.document.id);
  }

  RemoveFromDocumentGroup() {
    this.signalR.send("RemoveFromDocumentGroup", this.document.id);
  }

  saveDocument() {
    this.document.content = (<any>window).editor.getData();
    this.document.name = this.title;
    this.signalR.send("saveDocument", this.document);
  }

  initCkeEditor() {
    var editor = DecoupledEditor
    .create( document.querySelector( '#editor' ), {
    } )
    .then( editor => {
        const toolbarContainer = document.querySelector( '#toolbar-container' );
        toolbarContainer.appendChild( editor.ui.view.toolbar.element );
        (<any>window).editor = editor;
    } )
    .catch( error => {
        console.error( error );
    } );
  }

  onKeydown(event) {
    setTimeout(() => {
    this.updateDocument();
    }, 200);
  }

  updateDocument() {
    this.document.content = (<any>window).editor.getData();
    this.document.name = this.title;
    this.signalR.send("updateDocumentContent", this.document)
    .catch((reason) => console.log("reason" + reason));
  }

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