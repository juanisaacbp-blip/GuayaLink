import { Component } from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  LanguageService
} from '../../services/language.service';


@Component({
  selector: 'app-nav',

  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive
  ],

  templateUrl:
    './nav.component.html',

  styleUrl:
    './nav.component.css'
})
export class NavComponent {

  constructor(
    public languageService:
      LanguageService
  ) {}


  t(
    key: string
  ): string {

    return this.languageService
      .t(key);

  }

}