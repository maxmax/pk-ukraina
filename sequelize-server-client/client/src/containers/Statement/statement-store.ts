import { observable, makeObservable, action } from 'mobx';
import { performRequest, ApiResponse } from '../../utils/apiUtils'; // додаємо імпорт із нашої універсальної функції
import { StatementProps } from './types';

// Оголошуємо клас для зберігання стану і виконання операцій з даними
class StatementStore {
  state: "none" | "pending" | "done" | "error";
  statementsData: StatementProps[];
  statementData: StatementProps | null;
  notifications: string | null;

  constructor() {
    // Ініціалізуємо поля класу і робимо їх спостережливими та додаємо дії
    makeObservable(this, {
      state: observable,
      statementsData: observable,
      statementData: observable,
      notifications: observable,
      getStatements: action.bound,
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

  // Отримуємо заявки
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
      await this.getStatements();
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
      // this.statementData = null;
      // this.state = "done";
      await this.getStatements();
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
      await this.getStatements();
    } catch (error) {
      this.state = "error";
    }
  }
}

// Створюємо єдиний екземпляр класу для використання в додатку
const statementStore = new StatementStore();

export default statementStore;
export { StatementStore };
