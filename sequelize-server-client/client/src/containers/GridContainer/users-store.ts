import { observable, makeObservable, action } from 'mobx';
import { performRequest } from '../../utils/apiUtils';
import { UsersProps } from './types';

enum UsersStoreState {
  None = "none",
  Pending = "pending",
  Done = "done",
  Error = "error",
}

class UsersStore {
  state: UsersStoreState;
  usersData: UsersProps[];

  constructor() {
    makeObservable(this, {
      state: observable,
      usersData: observable,
      getUsers: action.bound,
    });

    this.state = UsersStoreState.None;
    this.usersData = [];
  }

  async getUsers(): Promise<void> {
    try {
      this.state = UsersStoreState.Pending;
      const result = await performRequest<UsersProps[]>('fake/users', 'GET');
      this.usersData = result;
      this.state = UsersStoreState.Done;
    } catch (error) {
      this.state = UsersStoreState.Error;
    }
  }
}

const usersStore = new UsersStore();

export default usersStore;
export { UsersStore };
