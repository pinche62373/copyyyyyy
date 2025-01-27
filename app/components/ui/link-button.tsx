import type React from "react";
import { Button } from "#app/components/shared/button";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  to: string;
  text: string;
  secondary?: boolean;
}

export const LinkButton = ({ to, text, ...rest }: Props) => {
  return <Button type="button" text={text} to={to} {...rest} />;
};
