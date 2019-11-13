import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from 'src/app/services/signal-r.service';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { DocumentsService } from 'src/app/services/documents.service';
import { WebDocument } from 'src/app/interfaces/web-document';
import * as $ from 'jquery';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  document: WebDocument;
  title: string;
  processing: Boolean = false;
  ckeditor: any;

  constructor(
    private signalR: SignalRService,
    private route: ActivatedRoute,
    private router: Router,
    private docsService: DocumentsService,
    private snackBar: SnackBarService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.initCkeEditor();
    this.signalR.startConnection().finally(() => {
      this.initWorkspace();
      this.registerConnections();
      setTimeout(() => this.AddToDocumentGroup(), 300);
      this.spinner.hide();
    });
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
              this.ckeditor.setData(this.document.content);
            }
          }));
    }
  }

  registerConnections() {
    this.signalR.registerHandler("ReceiveDocumentContent", (content: string) => {
      this.document.content = content;
      this.spinner.show();
      this.ckeditor.setData(content);
      this.spinner.hide();
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
    this.document.content = this.ckeditor.getData();
    this.document.name = this.title;
    this.spinner.show();
    this.signalR.send("saveDocument", this.document).finally(() => this.spinner.hide());
  }

  initCkeEditor() {
    DecoupledEditor
      .create(document.querySelector('#editor'), {
      })
      .then(editor => {
        const toolbarContainer = document.querySelector('#toolbar-container');
        toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        this.ckeditor = editor;
      })
      .catch(error => {
        console.error(error);
      });
  }

  onKeyup(event) {
    console.log("pressed key");
    setTimeout(() => {
      this.updateDocument();
    }, 1);
  }

  updateDocument() {
    this.getEditorData().then(() => this.spinner.show()).finally(() => console.log("pobralem dane"));
    
    this.signalR.send("updateDocumentContent", this.document)
    .finally(() => {
        this.spinner.hide();
      });
  }

  getEditorData() : Promise<void> {
    this.document.content = this.ckeditor.getData();
    this.document.name = this.title;

    return Promise.resolve();
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