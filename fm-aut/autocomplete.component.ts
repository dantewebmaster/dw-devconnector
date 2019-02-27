import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IDrugstore } from 'src/app/models/drugstore.interface';
// import { Observable } from 'rxjs';
// import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnChanges {

  // @Input() searchValue: string;
  @Input() drugstores: object[];
  @Input() fieldValue: string;
  @Output() updateTextField = new EventEmitter<string>();
  @Output() clearOptions = new EventEmitter<boolean>();

  searchField = new FormControl('');

  constructor() { }

  // ngOnInit() {}

  // ngOnChanges() {
  //   this.updateTextField.emit(this.searchField.value);
  // }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let change = changes[propName];

      let curVal = JSON.stringify(change.currentValue);
      let prevVal = JSON.stringify(change.previousValue);
      let changeLog = `${propName}: currentValue = ${curVal}, previousValue = ${prevVal}`;

      if (propName === 'fieldValue') {
        console.log(propName)
      } else if (propName === 'searchField') {
        console.log(propName)
      }
    }
  }

  // Change the display on select
  displayFn(option?: IDrugstore): string | undefined {
    return option ? `${option.id} - ${option.descricao}` : undefined;
  }

  clearValue() {
    return this.clearOptions.emit();
  }

}
