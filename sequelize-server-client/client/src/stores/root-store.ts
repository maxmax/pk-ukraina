import statementStore from "../containers/Statement/statement-store";

class RootStore {
  private readonly _statementStore = statementStore;
}

const rootStore = new RootStore();

export const stores = {
  statementStore,
  rootStore,
}
