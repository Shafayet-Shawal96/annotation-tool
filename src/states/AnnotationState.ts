import { makeAutoObservable } from "mobx";

export class AuthState {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const authState = new AuthState();
