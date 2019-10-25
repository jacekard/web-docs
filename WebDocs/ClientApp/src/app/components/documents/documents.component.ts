import { Component, OnInit } from '@angular/core';
import { DocumentsService } from 'src/app/services/documents.service';
import { Router } from '@angular/router';
import { WebDocument } from 'src/app/interfaces/webDocument';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  constructor(
    private docsService: DocumentsService,
    private router: Router) { }

  documents: WebDocument[]

  ngOnInit() {
    this.docsService.getAllDocuments().then((response =>
      response.subscribe(docs => this.documents = docs)));
  }

  create() {
    this.docsService.createNewDocument()
    .then(p => p
      .subscribe((doc) => {
        this.router.navigateByUrl(`/workspace/${doc.id}`);
      }));
  }

  edit(id: number) {
    this.router.navigateByUrl(`/workspace/${id}`);
  }

  delete(docId: number) {
    this.docsService.deleteDocument(docId).then(
      () => {
        var index = this.documents.findIndex(function(doc) {
          return doc.id === docId;
        });
        if (index !== -1)
          this.documents.splice(index, 1);
      });
  }

  showMenu(tooltip, docId: number) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } 
    else {
      tooltip.open({docId});
    }
  }
}
