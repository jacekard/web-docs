import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebDocument } from '../interfaces/webDocument';


@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(private http: HttpClient) { }

  getAllDocuments(): Observable<WebDocument[]> {
    return this.http.get<WebDocument[]>(`/api/documents`);
  }

  getDocument(id: string): Observable<WebDocument> {
    return this.http.get<WebDocument>(`/api/documents/${id}`);
  }
}
