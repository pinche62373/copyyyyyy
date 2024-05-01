export function validateIntent(
  formData: FormData,
  intent: "create" | "update" | "delete",
) {
  if (formData.get("intent") !== intent) {
    throw new Error(`Invalid intent: ${formData.get("intent") ?? "Missing"}`);
  }
}
