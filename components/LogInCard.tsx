import { Card, Container, ContainerProps, Image } from "@mantine/core";
import React, { PropsWithChildren } from "react";
import styled from "@emotion/styled";

const { Section } = Card;

const StyledContainer: React.FC<ContainerProps> = styled(Container)`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
`;

const LogInCard: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <StyledContainer size={"xs"}>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Section p={"3rem"}>
          <Image src="/server/undraw_world_re_768g.svg" alt="The World" />
        </Section>
        {children}
      </Card>
    </StyledContainer>
  );
};

export default React.memo(LogInCard);
