import type { IntentType } from "#app/validations/validate-form-intent";

interface PropTypes {
  intent: IntentType;
}

export function FormIntent({ intent }: PropTypes) {
  return <input type="hidden" name="intent" value={intent} />;
}
