import { Component, OnInit } from '@angular/core';
import { DocumentsService } from 'src/app/services/documents.service';
import { Router } from '@angular/router';
import { WebDocument } from '../../interfaces/webDocument';
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
    this.docsService.getAllDocuments().subscribe((docs) => this.documents = docs);
  }

  create() {
    this.router.navigateByUrl(`/workspace/#`);
  }

  edit(id: number) {
    this.router.navigateByUrl(`/workspace/${id}`);
  }
}
