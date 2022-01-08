import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: any, args: any): any {
    if (!args) {
      return value;
    }
    // Match the string we want to highlight, gi is used for case insensitive search
    const re = new RegExp(args, 'gi');
    const match = value.match(re);

    // If there's no match, just return the original value.
    if (!match) {
      return value;
    }

    const replacedValue = value.replace(re, `<strong>${match[0]}</strong>`);
    return this.sanitizer.bypassSecurityTrustHtml(replacedValue);
  }
}
