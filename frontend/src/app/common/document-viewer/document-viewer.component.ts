import { Component, Input, OnChanges } from '@angular/core';
import { UistateService } from '../../shared/uistate.service';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.styl']
})
export class DocumentViewerComponent implements OnChanges {
  @Input() document: string;
  showDocument = '';

  constructor(private uistateService: UistateService) {
  }

  ngOnChanges() {
    // When the document changes, update the highlighting
    // and listen to changes in the highlighting setting.
    this.updateHighlighting();
    this.uistateService.highlightUpdated.subscribe(
      (highlight) => {
        this.updateHighlighting();
      }
    );
  }

  updateHighlighting() {
    if (this.uistateService.highlight) {
      const doc = this.document;

      // Insert a span for every match
      this.showDocument = doc.replace(
        new RegExp(this.uistateService.highlight, 'gi'), match => {
          return '<span style="background-color: yellow">' + match + '</span>';
        });
    } else {
      this.showDocument = this.document;
    }
  }

}
