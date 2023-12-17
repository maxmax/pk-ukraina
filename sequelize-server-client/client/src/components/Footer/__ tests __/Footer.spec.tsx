// src/components/Footer/__ tests __/Footer.spec.tsx

import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react"
import Footer from "../../Footer"

test('demo', () => {
	expect(true).toBe(true)
})

test("Renders the Footer", () => {
	render(<Footer />)
	expect(true).toBeTruthy()
})

test('renders Footer component with correct copyright text', () => {
  render(<Footer />);

  // Check that the text "pk-ukraina" is present in the component
  const linkElement = screen.getByText(/pk-ukraina/i);
  expect(linkElement).toBeInTheDocument();

  // Check that the text "Copyright ©" is also present
  const copyrightText = screen.getByText(/copyright/i);
  expect(copyrightText).toBeInTheDocument();

  // Check that the current year is present in the text
  const currentYear = new Date().getFullYear();
  const yearText = screen.getByText(new RegExp(currentYear.toString()));
  expect(yearText).toBeInTheDocument();
});