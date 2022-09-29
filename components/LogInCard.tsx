import { Card, CardProps, styled } from "@mui/joy";
import React from "react";

const LogInCardWS: React.FC<CardProps> = styled(Card)`
  gap: 1rem;
  align-items: center;

  transform: translateY(-2rem) scale(1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-2.2rem) scale(1.1);
  }
`;

const LogInCard: React.FC<CardProps> = (props) => {
  return <LogInCardWS {...props} variant={"outlined"} />;
};

export default React.memo(LogInCard);
