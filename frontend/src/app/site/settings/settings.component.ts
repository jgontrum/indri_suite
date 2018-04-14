import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../shared/config.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.styl']
})
export class SettingsComponent implements OnInit {

  corpusPath: string;
  indexPath: string;
  goldPath: string;

  constructor(public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    const settings = ConfigService.settings;
    this.indexPath = settings['index_path'];
    this.corpusPath = settings['corpus_path'];
    this.goldPath = settings['gold_eval_path'];
  }

  save() {
    ConfigService.settings = {
      'index_path': this.indexPath,
      'corpus_path': this.corpusPath,
      'gold_eval_path': this.goldPath
    };
    this.snackBar.open('Settings have been saved.', 'OK', {duration: 2000});
  }

}

