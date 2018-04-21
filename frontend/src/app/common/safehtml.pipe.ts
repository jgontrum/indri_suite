import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safehtml'
})
export class SafehtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(html) {
    // Pipe to dynamically render HTML. Used to show the document.
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
