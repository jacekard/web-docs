import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizeService } from '../../api-authorization/authorize.service';
import { WebDocument } from '../interfaces/webDocument';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(
    private http: HttpClient,
    private authService: AuthorizeService) { }

  async getAllDocuments(): Promise<Observable<WebDocument[]>> {
    const token = await this.authService.getAccessToken();
    const response = this.http.get<WebDocument[]>('/api/documents', { headers: !token ? {} : {'Authorization': `Bearer ${token}`}});
    return response;
  }

  async getDocument(id: number): Promise<Observable<WebDocument>> {
    const token = await this.authService.getAccessToken();
    const response = this.http.get<WebDocument>(`/api/documents/${id}`, { headers: !token ? {} : {'Authorization': `Bearer ${token}`}});
    return response;
  }

  async createNewDocument() : Promise<Observable<WebDocument>> {
    const token = await this.authService.getAccessToken();
    const response = this.http.get<WebDocument>(`/api/documents/0`, { headers: !token ? {} : {'Authorization': `Bearer ${token}`}});
    return response;
  }

  async deleteDocument(document: WebDocument) : Promise<any> {

    /* TODO, naprawić. W obiekcie document nie ma userId i nie mapuje sie z kontrolerem [FromBody]...*/
    const token = await this.authService.getAccessToken();
    const httpOptions = {
      headers: new HttpHeaders(!token ? {} : {'Authorization': `Bearer ${token}`}),
      body: document 
    }
    const response = this.http.delete('/api/documents/', httpOptions)
    
    return response;
  }
}
