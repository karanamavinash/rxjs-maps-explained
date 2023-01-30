import { Component, VERSION } from '@angular/core';
import { concatMap, exhaustMap, from, of, Subject, Subscription } from 'rxjs';
import {
  takeUntil,
  delay,
  mergeMap,
  tap,
  switchMap,
  map,
  finalize,
} from 'rxjs/operators';

@Component({
  selector: 'my-app',
  template: `maps
  <br />
  <br />
  <button (click)="callObservables()">START</button>
  <br />
  <br />
  <button (click)="stopObservables()">STOP</button>
  `,
  styleUrls: [],
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  private readonly _unsubscribe$ = new Subject<void>();
  private subscriptions: Subscription;

  callObservables() {
    console.clear();
    this.subscriptions = from([
      fiveSecondSource,
      oneSecondSource,
      threeSecondSource,
      fourSecondSource,
      twoSecondSource,
    ])
      .pipe(
        // tap((value) => console.log('--> sent out', value)),
        mergeMap((o, i) => o.pipe(map((obj) => ({ index: i, obj })))),
        // switchMap((o,i) => o.pipe(map((obj) => ({index: i, obj})))),
        // concatMap((o,i) => o.pipe(map((obj) => ({index: i, obj})))),
        // exhaustMap((o,i) => o.pipe(map((obj) => ({index: i, obj})))),
        takeUntil(this._unsubscribe$)
      )
      .subscribe({
        next: (v) => console.log(v),
        error: (e) => console.error(e),
        complete: () => console.info('complete') 
    })
      // .subscribe((x) => console.log(x),error=>console.error(error),()=>console.log('completed'))
  }
  stopObservables() {
      console.log('stopped');
      this.subscriptions.unsubscribe();
      this._unsubscribe$.next(undefined);
      this._unsubscribe$.complete();
  }
}

const oneSecondSource = of('1 second http request').pipe(delay(1000));
const twoSecondSource = of('2 second http request').pipe(delay(2000));
const threeSecondSource = of('3 second http request').pipe(delay(3000));
const fourSecondSource = of('4 second http request').pipe(delay(4000));
const fiveSecondSource = of('5 second http request').pipe(delay(5000));
