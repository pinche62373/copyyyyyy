export type Intent = "create" | "update" | "delete" | "login" | "purge";

interface Args {
  formData: FormData;
  intent: Intent;
}
export function validateFormIntent({ intent, formData }: Args) {
  if (formData.get("intent") !== intent) {
    throw new Response("Unprocessable Entity", {
      status: 422,
      statusText: "Unprocessable Entity",
    });
  }
}
