import { observable, makeObservable, action } from 'mobx';
import { performRequest, ApiResponse } from '../../utils/apiUtils'; // додаємо імпорт із нашої універсальної функції
import { StatementProps, StatementDataPagination } from './types';

// Оголошуємо клас для зберігання стану і виконання операцій з даними
class StatementStore {
  state: "none" | "pending" | "done" | "error";
  statementsData: StatementProps[];
  statementData: StatementProps | null;
  statementsDataPagination: StatementDataPagination | null | undefined;
  notifications: string | null;
  page: 1 = 1;
  pageSize: 5 = 5;

  constructor() {
    // Ініціалізуємо поля класу і робимо їх спостережливими та додаємо дії
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
    });
    
    this.state = "none";
    this.statementsData = [];
    this.statementData = null;
    this.notifications = null;
  }

  // Отримуємо всі заявки, але взагалі вона нам уже не впала, потім її заберу
  async getStatements(): Promise<void> {
    try {
      this.state = "pending";
      const result = await performRequest<StatementProps[]>('statements', 'GET');
      this.statementsData = result;
      this.state = "done";
    } catch (error) {
      this.state = "error";
    }
  }

  // Отримуємо заявкиз а нумерацією сторінок
  async getStatementsPagination(page: number, pageSize: number): Promise<void> {
    try {
      this.state = "pending";
      const result = await performRequest<StatementDataPagination>(`statements/pagination?page=${page}&pageSize=${pageSize}`, 'GET');
      this.statementsDataPagination = result;
      this.page = result.currentPage as any; // тут просто в лом зараз фіксувати по нормальному, потім поправимо типу технічний борг хаха
      this.pageSize = result.pageSize as any;
      this.state = "done";
    } catch (error) {
      this.state = "error";
    }
  }

  // Отримуємо конкретну заявку за ідентифікатором
  async getStatement(id: number): Promise<void> {
    try {
      this.state = "pending";
      const result = await performRequest<StatementProps>(`statements/${id}`, 'GET');
      this.statementData = result;
      this.state = "done";
    } catch (error) {
      this.state = "error";
    }
  }

  // Видаляємо заявку за ідентифікатором
  async deleteStatement(id: number): Promise<void> {
    try {
      this.state = "pending";
      const result = await performRequest<ApiResponse>(`statements/${id}`, 'DELETE');
      this.notifications = result.message;
      this.statementData = null;
      await this.getStatementsPagination(this.page, this.pageSize);
    } catch (error) {
      this.state = "error";
    }
  }

  // Створюємо нову заявку
  async createStatement(data: StatementProps): Promise<void> {
    try {
      this.state = "pending";
      const result = await performRequest<ApiResponse>('statements', 'POST', data);
      this.notifications = result.message;
      await this.getStatementsPagination(this.page, this.pageSize);
    } catch (error) {
      this.state = "error";
    }
  }

  // Оновлюємо існуючу заявку
  async updateStatement(data: StatementProps): Promise<void> {
    try {
      this.state = "pending";
      const result = await performRequest<ApiResponse>(`statements/${data.id}`, 'PUT', data);
      this.notifications = result.message;
      this.statementData = null;
      await this.getStatementsPagination(this.page, this.pageSize);
    } catch (error) {
      this.state = "error";
    }
  }
}

// Створюємо єдиний екземпляр класу для використання в додатку
const statementStore = new StatementStore();

export default statementStore;
export { StatementStore };
