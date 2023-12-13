import { observable, makeObservable, action } from 'mobx';
import { toJS } from 'mobx';

const APP_API_SOURCE = import.meta.env.VITE_APP_API_SOURCE;

class StatementStore {
  state = "none";
  statementsData = [];
  statementData = null;
  notifications = null;

  constructor() {
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
    })
  }

  getStatements() {
    const url = `${APP_API_SOURCE}/statements`;
    this.state = "pending";
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(result => {
        this.statementsData = result;
        this.state = "done";
      })
      .catch((response) => {
        console.log('error:', response)
        this.state = "error";
      });
  }

  getStatement(id: number) {
    const url = `${APP_API_SOURCE}/statements/${id}`;
    this.state = "pending";
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(result => {
        this.statementData = result;
        this.state = "done";
      })
      .catch((response) => {
        console.log('error:', response)
        this.state = "error";
      });
  }

  deleteStatement(id: number) {
    const url = `${APP_API_SOURCE}/statements/${id}`;
    this.state = "pending";
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(result => {
        this.notifications = result.message;
        this.getStatements();
        this.state = "done";
      })
      .catch((response) => {
        console.log('error:', response)
        this.state = "error";
      });
  }

  createStatement(data) {
    const url = `${APP_API_SOURCE}/statements`;
    this.state = "pending";
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        this.notifications = result.message;
        this.getStatements();
        this.state = "done";
      })
      .catch((response) => {
        console.log('error:', response)
        this.state = "error";
      });
  }

  updateStatement(data) {
    const url = `${APP_API_SOURCE}/statements/${data.id}`;
    this.state = "pending";
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description
      })
    })
      .then(response => response.json())
      .then(result => {
        this.notifications = result.message;
        this.getStatements();
        this.state = "done";
      })
      .catch((response) => {
        console.log('error:', response)
        this.state = "error";
      });
  }

}

const statementStore = new StatementStore();

export default statementStore;
export { StatementStore };
