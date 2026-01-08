import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    private url = 'http://192.168.0.152:3000'!;
    private socket;

    constructor(
        private http: HttpClient
    ) {
        this.socket = io.io(this.url);
    }

    getItems(): Observable<any> {
        return this.http.get(`${this.url}/items`);
    }

    addItem(item: any): void {
        this.socket.emit('addItem', item);
    }

    getItemAdded(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('itemAdded', (item) => {
                observer.next(item);
            });
        });
    }

    updateItem(item: any): void {
         this.socket.emit('updateItem', item);
    }

    getItemUpdated(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('itemUpdated', (item) => {
                console.log(item);
                observer.next(item);
            });
        });
    }

    deleteItem(id: string): void {
        this.socket.emit('deleteItem', id);
    }

    getItemDeleted(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('itemDeleted', (id) => {
                observer.next(id);
            });
        });
    }
}