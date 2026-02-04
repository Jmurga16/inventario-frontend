import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {
  readonly #optionSelected = new Subject<void>();
  readonly optionSelected$ = this.#optionSelected.asObservable();

  notifyOptionSelected(): void {
    this.#optionSelected.next(undefined);
  }
}
