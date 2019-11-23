import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from 'src/app/services/signal-r.service';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { DocumentsService } from 'src/app/services/documents.service';
import { WebDocument } from 'src/app/interfaces/web-document';
import * as $ from 'jquery';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { v4 as uuid } from 'uuid';
import { Location } from '@angular/common';

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
  isSaving: Boolean = false;
  routeId: number;
  trySaveInterval: any;

  constructor(
    private signalR: SignalRService,
    private route: ActivatedRoute,
    private router: Router,
    private docsService: DocumentsService,
    private snackBar: SnackBarService,
    private spinner: NgxSpinnerService,
    private location: Location) {
      this.checkRouteId();
    }

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

  checkRouteId() {
    const id = this.route.snapshot.paramMap.get('id');
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      this.location.back();
    }
    else {
      this.routeId = parsedId;
    }
  }

  initWorkspace() {
    this.docsService.getDocument(this.routeId)
      .then(p => p
        .subscribe((doc) => {
          this.document = doc;
          this.title = this.document.name;
          this.document.latestVersion = uuid();
          if (this.document.content !== null) {
            this.ckeditor.setData(this.document.content);
          }
        },
        error => {
          this.location.back();
        }));
  }

  registerConnections() {
    this.signalR.registerHandler("ReceiveDocumentContent", (content: string, latestVersion: string) => {
      this.document.content = content;
      this.document.latestVersion = latestVersion;
      this.ckeditor.setData(content);
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

  SendSaveDocument(): Boolean {
    console.log(this.document.latestVersion);
    this.docsService.saveDocument(this.document).subscribe(
      (data: any) => {
        this.isSaving = false;
        this.spinner.hide();
        return true;
      },
      error => {
        console.log(error)
        return false;
      }
    );
    return true;
  }

  saveDocument() {
    this.spinner.show();
    this.isSaving = true;
    this.document.content = this.ckeditor.getData();
    this.document.name = this.title;
    this.trySaveInterval = setInterval(() => this.trySaveDocument(), 200);
  }

  trySaveDocument() {
    if(this.SendSaveDocument()) {
      clearInterval(this.trySaveInterval);
    }
  }

  onNameChange($event) {
    this.document.latestVersion = uuid();
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
    setTimeout(() => {
      this.updateDocument();
    }, 1);
  }

  updateDocument() {
    this.document.content = this.ckeditor.getData();
    this.document.name = this.title;
    this.document.latestVersion = uuid();

    this.signalR.send("updateDocumentContent", this.document)
      .finally(() => {
        this.spinner.hide();
      });
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