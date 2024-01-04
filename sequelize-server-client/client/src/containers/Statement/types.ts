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

export type NewStatementProps = {
	diskNumber: string;
	outputName: string;
	inputName: string;
	deedNumber: string;
	notes: string;
}

export type StatementStoreProps = {
  state: string;
  page: number;
  pageSize: number;
  statementsData: StatementProps[];
  statementData: StatementProps;
  statementsDataPagination: StatementDataPagination;
  getStatements: () => Promise<void>;
  getStatementsPagination: (page: number, pageSize: number) => Promise<void>;
  getStatement: (id: number) => Promise<void>;
  deleteStatement: (id: number) => Promise<void>;
  createStatement: (data: NewStatementProps) => Promise<void>;
  updateStatement: (data: StatementProps) => Promise<void>;
  notifications: string;
  setNotifications: (value: string | null) => void;
};
