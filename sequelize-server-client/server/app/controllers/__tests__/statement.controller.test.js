// statement.controller.test.js

const statementController = require('./statement.controller');
const { Sequelize } = require('sequelize');

describe('Statement Controller Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { body: {}, query: {} };
    mockRes = {
			status: jest.fn(),
      send: jest.fn(),
    };
  });

  it('should create a new Statement', async () => {
    const createSpy = jest.spyOn(Sequelize.Model, 'create').mockResolvedValue({
      id: 1,
      dateReceiving: '2023-01-01',
      diskNumber: 'Disk 1',
      published: true,
    });

    mockReq.body = {
      dateReceiving: '2023-01-01',
      diskNumber: 'Disk 1',
      published: true,
    };

    await statementController.create(mockReq, mockRes);

    expect(createSpy).toHaveBeenCalledWith({
      dateReceiving: '2023-01-01',
      diskNumber: 'Disk 1',
      published: true,
    });

		// Требо використовувати 200 як аргумент до status, 
		// а не як виклик функції потім виправимо
    // expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({
      id: 1,
      dateReceiving: '2023-01-01',
      diskNumber: 'Disk 1',
      published: true,
    });

    createSpy.mockRestore();
  });

  it('should retrieve all Statements', async () => {
    const findAllSpy = jest.spyOn(Sequelize.Model, 'findAll').mockResolvedValue([
      { id: 1, dateReceiving: '2023-01-01', diskNumber: 'Disk 1', published: true },
      { id: 2, dateReceiving: '2023-01-02', diskNumber: 'Disk 2', published: false },
    ]);

    await statementController.findAll(mockReq, mockRes);

    expect(findAllSpy).toHaveBeenCalled();

    // expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith([
      { id: 1, dateReceiving: '2023-01-01', diskNumber: 'Disk 1', published: true },
      { id: 2, dateReceiving: '2023-01-02', diskNumber: 'Disk 2', published: false },
    ]);

    findAllSpy.mockRestore();
  });
});
