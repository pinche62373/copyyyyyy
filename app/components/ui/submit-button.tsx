import React from "react";
import type { Navigation } from "react-router";
import { Button } from "#app/components/shared/button";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  navigation: Navigation;
  text?: string;
}

export const SubmitButton = ({ navigation, text }: Props) => {
  const buttonText = text || "Submit";

  return (
    <Button
      type="submit"
      text={buttonText}
      disabled={navigation.state === "submitting"}
    />
  );
};
