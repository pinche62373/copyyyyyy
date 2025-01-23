import type React from "react";
import type { Navigation } from "react-router";
import { Button } from "#app/components/shared/button";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  navigation?: Navigation;
  disabled: boolean;
  text?: string;
}

export const SubmitButton = ({ disabled, text }: Props) => {
  const buttonText = text || "Submit";

  return <Button type="submit" text={buttonText} disabled={disabled} />;
};
