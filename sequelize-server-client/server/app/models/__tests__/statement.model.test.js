// statement.model.test.js

const { Sequelize, DataTypes } = require('sequelize');
const statementModel = require('./statement.model');

describe('Statement Model', () => {
  // Використовуємо SQLite у пам'яті для ізоляції тестів
  const sequelize = new Sequelize('sqlite::memory:', { dialect: 'sqlite' });
  const Statement = statementModel(sequelize, DataTypes);

  beforeAll(async () => {
    // Створюємо таблицю у базі даних
    await Statement.sync();
  });

  it('should create and retrieve a Statement instance', async () => {
    // Демо дані
    const demoData = {
      dateReceiving: '2023-01-01',
      diskNumber: 'Disk 1',
      outputName: 'Output 1',
      inputName: 'Input 1',
      deedNumber: 'Deed 1',
      notes: 'Notes 1',
      published: true,
    };

    // Створюємо екземпляр Statement
    const createdStatement = await Statement.create(demoData);

    // Отримуємо екземпляр Statement з бази даних
    const retrievedStatement = await Statement.findOne({ where: { diskNumber: 'Disk 1' } });

    // Перевіряємо, що дані створеного та отриманого екземплярів збігаються
    expect(retrievedStatement).toBeDefined();
    expect(retrievedStatement.dateReceiving).toBe(demoData.dateReceiving);
    expect(retrievedStatement.diskNumber).toBe(demoData.diskNumber);
    expect(retrievedStatement.outputName).toBe(demoData.outputName);
    expect(retrievedStatement.inputName).toBe(demoData.inputName);
    expect(retrievedStatement.deedNumber).toBe(demoData.deedNumber);
    expect(retrievedStatement.notes).toBe(demoData.notes);
    expect(retrievedStatement.published).toBe(demoData.published);
  });

  // Додайте інші тести в міру необхідності

  afterAll(async () => {
    // Закриваємо з'єднання з базою даних
    await sequelize.close();
  });
});
