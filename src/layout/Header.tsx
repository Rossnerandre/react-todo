import { styled } from "@stitches/react";

const StyledHeader = styled("header", {
  backgroundColor: "#1677ff",
  height: 72,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export function Header() {
  return (
    <StyledHeader>
      <h1>React Todo List</h1>
    </StyledHeader>
  );
}
