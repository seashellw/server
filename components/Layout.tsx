import React, { PropsWithChildren } from "react";
import { AppShell } from "@mantine/core";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <AppShell>{children}</AppShell>;
};

export default React.memo(Layout);
