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
    this.router.navigateByUrl(`/workspace/new`);
  }

  edit(id: number) {
    this.router.navigateByUrl(`/workspace/${id}`);
  }

  delete(document: WebDocument) {
    console.log(document);
    this.docsService.deleteDocument(document).then(
      () => this.ngOnInit());
  }

  showMenu(tooltip, document: WebDocument) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } 
    else {
      tooltip.open({document});
    }
  }
}
