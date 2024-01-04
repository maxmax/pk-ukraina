import { observable, makeObservable, action } from 'mobx';
import { performRequest, ApiResponse } from '../../utils/apiUtils';
import { StatementProps, StatementDataPagination } from './types';

enum StatementStoreState {
  None = "none",
  Pending = "pending",
  Done = "done",
  Error = "error",
}

class StatementStore {
  state: StatementStoreState;
  statementsData: StatementProps[];
  statementData: StatementProps | null;
  statementsDataPagination: StatementDataPagination | null | undefined;
  notifications: string | null;
  page: number = 1;
  pageSize: number = 5;

  constructor() {
    makeObservable(this, {
      state: observable,
      page: observable,
      pageSize: observable,
      statementsData: observable,
      statementsDataPagination: observable,
      statementData: observable,
      notifications: observable,
      getStatements: action.bound,
      getStatementsPagination: action.bound,
      getStatement: action.bound,
      deleteStatement: action.bound,
      createStatement: action.bound,
      updateStatement: action.bound,
      setNotifications: action.bound,
    });

    this.state = StatementStoreState.None;
    this.statementsData = [];
    this.statementData = null;
    this.notifications = null;
  }

  setNotifications(value: string | null) {
    this.notifications = value;
  }

  async getStatements(): Promise<void> {
    try {
      this.state = StatementStoreState.Pending;
      const result = await performRequest<StatementProps[]>('statements', 'GET');
      this.statementsData = result;
      this.state = StatementStoreState.Done;
    } catch (error) {
      this.state = StatementStoreState.Error;
    }
  }

  async getStatementsPagination(page: number, pageSize: number): Promise<void> {
    try {
      this.state = StatementStoreState.Pending;
      const result = await performRequest<StatementDataPagination>(`statements/pagination?page=${page}&pageSize=${pageSize}`, 'GET');
      this.statementsDataPagination = result;
      this.page = result.currentPage;
      this.pageSize = result.pageSize;
      this.state = StatementStoreState.Done;
    } catch (error) {
      await this.setNotifications('Something went wrong!');
      this.state = StatementStoreState.Error;
    }
  }

  async getStatement(id: number): Promise<void> {
    try {
      const result = await performRequest<StatementProps>(`statements/${id}`, 'GET');
      this.statementData = result;
    } catch (error) {
      await this.setNotifications('Something went wrong!');
      this.state = StatementStoreState.Error;
    }
  }

  async deleteStatement(id: number): Promise<void> {
    try {
      this.state = StatementStoreState.Pending;
      const result = await performRequest<ApiResponse>(`statements/${id}`, 'DELETE');
      await this.setNotifications(result.message);
      this.statementData = null;
      await this.getStatementsPagination(this.page, this.pageSize);
    } catch (error) {
      await this.setNotifications('Something went wrong!');
      this.state = StatementStoreState.Error;
    }
  }

  async createStatement(data: StatementProps): Promise<void> {
    try {
      this.state = StatementStoreState.Pending;
      const result = await performRequest<ApiResponse>('statements', 'POST', data);
      await this.setNotifications("New request created!");
      await this.getStatementsPagination(this.page, this.pageSize);
    } catch (error) {
      await this.setNotifications('Something went wrong!');
      this.state = StatementStoreState.Error;
    }
  }

  async updateStatement(data: StatementProps): Promise<void> {
    try {
      this.state = StatementStoreState.Pending;
      const result = await performRequest<ApiResponse>(`statements/${data.id}`, 'PUT', data);
      await this.setNotifications(result.message);
      this.statementData = null;
      await this.getStatementsPagination(this.page, this.pageSize);
    } catch (error) {
      await this.setNotifications('Something went wrong!');
      this.state = StatementStoreState.Error;
    }
  }
}

const statementStore = new StatementStore();

export default statementStore;
export { StatementStore };
