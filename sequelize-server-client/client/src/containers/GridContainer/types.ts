export type UsersProps = {
  firstName: string;
  lastName: string;
  username: string;
  age: number;
  email: string;
};

export type UsersStoreProps = {
  state: string;
  usersData: UsersProps[];
  getStatements: () => Promise<void>;
};
