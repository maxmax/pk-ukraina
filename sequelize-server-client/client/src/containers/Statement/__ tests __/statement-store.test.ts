import { StatementStore } from '../statement-store';
import { performRequest } from '../../../utils/apiUtils';

// Mock performRequest функции
jest.mock('../../../utils/apiUtils', () => ({
  performRequest: jest.fn(),
}));

describe('StatementStore', () => {
  let statementStore: StatementStore;

  beforeEach(() => {
    statementStore = new StatementStore();
  });

  it('should fetch statements', async () => {
    const mockStatements = [
      { id: 1, diskNumber: '123', dateReceiving: '2022-01-01', otherProps: 'otherProps' },
      // Добавьте больше заявок по мере необходимости
    ];

    // Mock performRequest to return mockStatements
    (performRequest as jest.Mock).mockResolvedValue(mockStatements);

    await statementStore.getStatements();

    expect(statementStore.state).toBe('done');
    expect(statementStore.statementsData).toEqual(mockStatements);
  });

  it('should handle error while fetching statements', async () => {
    // Mock performRequest to throw an error
    (performRequest as jest.Mock).mockRejectedValue(new Error('Error fetching statements'));

    await statementStore.getStatements();

    expect(statementStore.state).toBe('error');
  });

  // Добавьте аналогичные тесты для других методов (getStatement, deleteStatement, createStatement, updateStatement)
});
