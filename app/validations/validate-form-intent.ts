export type IntentType = "create" | "update" | "delete" | "login"

export function validateFormIntent(
  formData: FormData,
  intent: IntentType
) {
  console.log(`INTENT = ${formData.get("intent")}`)
  console.log(`EMAIL = ${formData.get("email")}`)

  if (formData.get("intent") !== intent) {
    throw new Error(`Invalid intent: ${formData.get("intent") ?? "Missing"}`);
  }
}
