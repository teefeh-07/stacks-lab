import { render, screen } from "@testing-library/react";
import { Card } from "@/components/ui/Card";

test("renders default card", () => {
  render(<Card>Content</Card>);
  expect(screen.getByText("Content")).toHaveClass("elevated");
});

test("renders outline card", () => {
  render(<Card variant="outline">Content</Card>);
  expect(screen.getByText("Content")).toHaveClass("outline");
});

