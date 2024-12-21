import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {
  private decimalPipe: DecimalPipe;

  constructor() {
    this.decimalPipe = new DecimalPipe('en-US'); // Provide the locale directly
  }

  transform(value: number): string | null {
    return this.decimalPipe.transform(value, '1.0-0');
  }
}
