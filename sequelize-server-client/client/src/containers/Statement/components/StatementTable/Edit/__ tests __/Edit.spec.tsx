// src/containers/Statement/components/StatementTable/Edit/__ tests __/Edit.spec.tsx

import '@testing-library/jest-dom'
import { render, screen, fireEvent } from "@testing-library/react"
import Edit from "../../Edit"

// Add createdAt and published properties to test data
const statementDataMock = {
  id: 1,
  dateReceiving: '2023-01-01',
  diskNumber: '123',
  outputName: 'John Doe',
  inputName: 'Jane Doe',
  deedNumber: '456',
  notes: 'Test notes',
  createdAt: '2023-01-01T12:00:00', // Example value, type must match a valid type in your application
  published: true, // Example value, type must match a valid type in your application
};

test('demo', () => {
	expect(true).toBe(true)
})

// Write more tests latter