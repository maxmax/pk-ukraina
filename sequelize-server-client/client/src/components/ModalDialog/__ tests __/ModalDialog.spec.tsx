// src/components/ModalDialog/__ tests __/ModalDialog.spec.tsx

import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@testing-library/react';
import ModalDialog from "../../ModalDialog"

test('demo', () => {
	expect(true).toBe(true)
})


test('renders ModalDialog component with open state', () => {
  const setParentOpenMock = jest.fn();

  render(
    <ModalDialog parentOpen={true} setParentOpen={setParentOpenMock}>
      <></>
    </ModalDialog>
  );

  // Check that the modal is rendered
  const modal = screen.getByRole('dialog');
  expect(modal).toBeInTheDocument();

  // Check that the close button is present
  const closeButton = screen.getByLabelText('close');
  expect(closeButton).toBeInTheDocument();

  // Simulate clicking the close button
  fireEvent.click(closeButton);

  // Check that the setParentOpen function is called
  expect(setParentOpenMock).toHaveBeenCalledWith(false);
});