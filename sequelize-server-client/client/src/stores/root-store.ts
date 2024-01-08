import statementStore from "../containers/Statement/statement-store";
import usersStore from "../containers/GridContainer/users-store";

class RootStore {
  private readonly _statementStore = statementStore;
}

const rootStore = new RootStore();

export const stores = {
  statementStore,
  usersStore,
  rootStore,
}
