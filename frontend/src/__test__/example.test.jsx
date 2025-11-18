import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from "vitest";
import App from "../App";

describe("AirBrB App Tests", () => {
  it("should pass basic test", () => {
    expect(true).toBe(true);
  });

  it("renders the app header with AirBrB title", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('AirBrB')).toBeInTheDocument();
    });
  });

  it("renders login and register buttons when not authenticated", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByLabelText('Login')).toBeInTheDocument();
      expect(screen.getByLabelText('Register')).toBeInTheDocument();
    });
  });

  it("renders the landing page loading state", async () => {
    render(<App />);
    // App should render without crashing
    expect(screen.getByText('AirBrB')).toBeInTheDocument();
  });
});
