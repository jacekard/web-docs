export class WebDocument {
    id: number;
    userId: string;
    name: string;
    content: string;
    lastModifiedDate: Date;

    constructor(userId) {
        this.id = 0;
        this.name = 'asd';
        this.content = '';
        this.lastModifiedDate = new Date();
        this.userId = userId;
    }
}