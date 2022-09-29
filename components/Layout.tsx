import { css, Global } from "@emotion/react";
import { Sheet, styled, useColorScheme } from "@mui/joy";
import { useLocalStorageState, useMount } from "ahooks";
import React, { PropsWithChildren } from "react";

export const useFirstVisit = (cb: () => void) => {
  const [isFirst, setIsFirst] = useLocalStorageState("isFirst", {
    defaultValue: true,
  });
  useMount(() => {
    if (isFirst) {
      cb();
      setIsFirst(false);
    }
  });
};

export const isDark = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const resetCss = css`
  html,
  body {
    margin: 0;
    padding: 0;
  }
  * {
    scroll-behavior: smooth;
    box-sizing: border-box;
  }
`;

const Container = styled(Sheet)`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: auto;
`;

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { setMode } = useColorScheme();

  useMount(() => {
    if (isDark()) {
      setMode("dark");
    } else {
      setMode("light");
    }
  });

  return (
    <Container>
      {children}
      <Global styles={resetCss} />
    </Container>
  );
};

export default React.memo(Layout);
