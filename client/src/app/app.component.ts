import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { ItemService } from './item.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  items: any[] = [];
  newItem: string = '';
  updateItemId: string = '';
  updateItemName: string = '';

  private itemAddedSubscription: any;
  private itemUpdatedSubscription: any;
  private itemDeletedSubscription: any;

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
      this.getItems();

      this.itemAddedSubscription = this.itemService.getItemAdded().subscribe(item => {
          this.items.push(item);
      });
      this.itemUpdatedSubscription = this.itemService.getItemUpdated().subscribe(updatedItem => {
         this.items = this.items.map(item => item._id === updatedItem._id ? updatedItem : item);
      });
      this.itemDeletedSubscription = this.itemService.getItemDeleted().subscribe(deletedItemId => {
          this.items = this.items.filter(item => item._id !== deletedItemId);
      });
  }

  ngOnDestroy(): void {
    this.itemAddedSubscription.unsubscribe();
    this.itemUpdatedSubscription.unsubscribe();
    this.itemDeletedSubscription.unsubscribe();
  }

  getItems() {
      this.itemService.getItems().subscribe(items => {
            console.log(items);
            
          this.items = items;
      });
  }

  addItem() {
      this.itemService.addItem({ name: this.newItem });
      this.newItem = '';
  }

  updateItem() {
      this.itemService.updateItem({ _id: this.updateItemId, name: this.updateItemName });
      this.updateItemId = '';
      this.updateItemName = '';
  }

  deleteItem(id: string) {
      this.itemService.deleteItem(id);
  }
}
