import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { observeOn, scan, withLatestFrom } from 'rxjs/operators';
import { queue } from 'rxjs/scheduler/queue';

import { Dispatcher } from './dispatcher';
import { Reducer } from './reducer';

export class State<T> extends BehaviorSubject<T> {
  constructor(initialState: T, action$: Dispatcher, reducer$: Reducer) {
    super(initialState);
    const actionInQueue$ = observeOn.call(action$, queue);
    const actionAndReducer$ = withLatestFrom.call(actionInQueue$, reducer$);
    const state$ = scan.call(
      actionAndReducer$,
      (state, [action, reducer]) => reducer(state, action),
      initialState,
    );
    state$.subscribe(value => this.next(value));
  }
}
