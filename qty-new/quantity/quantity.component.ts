import { Component, OnInit, OnChanges, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.scss']
})
export class QuantityComponent implements OnChanges {

  @Input()
  isDisabled: boolean = false;
  @Input()
  resetQuantity: boolean = false;
  // @Output()
  // resetQuantity: EventEmitter<number> = new EventEmitter();
  @Output()
  updateQuantity: EventEmitter<number> = new EventEmitter();

  public maskQuantity = [/\d/, /\d/];

  public quantity: number = 0;

  constructor () { }

  ngOnChanges() {
    if (this.resetQuantity) {
      console.log('resetou? ', this.resetQuantity)
      this.quantity = 0;
    }
    // Set initial value of 1...
    // @BUG: If select setting a value on input...
    // else {
    //   this.quantity = 1;
    // }
    console.log('changed ', this.quantity)
  }

  updateQuantityInput(newQuantity) {
    if (newQuantity <= 99 && newQuantity >= 0) {
      this.quantity = newQuantity;
      this.updateQuantity.emit(this.quantity)
    }
  }

  incrementQuantity() {
    if (this.quantity < 99) {
      this.quantity++;
      this.updateQuantity.emit(this.quantity)
    }
  }

  decrementQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
      this.updateQuantity.emit(this.quantity);
    }
  }

  // resetQuantityInput() {
  //   if(this.resetQuantity) {
  //     this.quantity = 0;
  //   }
  // }
}
