export type IntentType = "create" | "update" | "delete" | "login"

export function validateFormIntent(
  formData: FormData,
  intent: IntentType
) {
  if (formData.get("intent") !== intent) {
    throw new Error(`Invalid intent: ${formData.get("intent") ?? "Missing"}`);
  }
}
