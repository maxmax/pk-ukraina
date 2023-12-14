export type StatementProps = {
  id: number;
  createdAt: string;
  dateReceiving: string;
  diskNumber: string;
  outputName: string;
  inputName: string;
  deedNumber: string;
  notes: string;
  published: boolean;
};

export type StatementStoreProps = {
  state: string;
  statementsData: StatementProps[];
  statementData: StatementProps;
  getStatements: Function;
  getStatement: Function;
  deleteStatement: Function;
  createStatement: Function;
  updateStatement: Function;
  notifications: string;
};
