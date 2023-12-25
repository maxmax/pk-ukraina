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

export type StatementDataPagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  statements: StatementProps[];
};

export type StatementStoreProps = {
  state: string;
  page: number;
  pageSize: number;
  statementsData: StatementProps[];
  statementData: StatementProps;
  statementsDataPagination: StatementDataPagination;
  getStatements: Function;
  getStatementsPagination: Function;
  getStatement: Function;
  deleteStatement: Function;
  createStatement: Function;
  updateStatement: Function;
  notifications: string;
};
