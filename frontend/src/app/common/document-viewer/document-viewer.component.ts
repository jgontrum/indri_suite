import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.styl']
})
export class DocumentViewerComponent implements OnInit {
  @Input() document: string;

  constructor() {
  }

  ngOnInit() {
  }

}
