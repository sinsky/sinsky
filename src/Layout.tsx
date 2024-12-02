import { Outlet } from "react-router";
import { Container } from "@mantine/core";

export default function Layout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
