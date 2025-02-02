import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunctionArgs } from "react-router";
import {
  Form,
  redirect,
  data as returnData,
  useFetcher,
  useFetchers,
  useNavigation,
} from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { dataWithError } from "remix-toast";
import { ServerOnly } from "remix-utils/server-only";
import type zod from "zod";
import { Icon } from "#app/ui/upstream/icon.tsx";
import { useHints } from "#app/utils/client-hints.tsx";
import { useRequestInfo } from "#app/utils/request-info.ts";
import { setTheme } from "#app/utils/theme.server";
import type { Theme } from "#app/utils/theme.server.ts";
import { ThemeSchemaSwitch } from "#app/validations/theme-schema.ts";

const resolver = zodResolver(ThemeSchemaSwitch);

type FormData = zod.infer<typeof ThemeSchemaSwitch>;

/**
 * If the user's changing their theme mode preference, this will return the
 * value it's being changed to.
 */
export function useOptimisticThemeMode() {
  const fetchers = useFetchers();

  const themeFetcher = fetchers.find(
    (f) => f.formAction === "/resources/theme-switch",
  );

  if (themeFetcher && themeFetcher.formData) {
    const submission = ThemeSchemaSwitch.safeParse({
      intent: JSON.parse(themeFetcher.formData.get("intent") as string), // unescape RHF json-escaped string
      theme: JSON.parse(themeFetcher.formData.get("theme") as string),
    });

    if (!submission.error) {
      return submission.data.theme;
    }
  }
}

/**
 * @returns the client hint theme.
 */
export function useTheme() {
  const hints = useHints();
  const requestInfo = useRequestInfo();
  const optimisticMode = useOptimisticThemeMode();

  if (optimisticMode) {
    return optimisticMode === "system" ? hints.theme : optimisticMode;
  }

  return requestInfo.userPrefs.theme ?? hints.theme;
}

export async function action({ request }: ActionFunctionArgs) {
  const { data, errors } = await getValidatedFormData<FormData>(
    request,
    resolver,
  );

  if (errors) {
    return dataWithError({ errors }, "Form data rejected by server", {
      // status: 422, // TODO re-enable when remix-toast fixes this
    });
  }

  const { theme, redirectTo } = data;

  if (redirectTo) {
    return redirect(redirectTo, { headers: { "set-cookie": setTheme(theme) } });
  }

  return returnData(
    {
      defaultValues: {
        intent: "update",
        theme: data.theme,
      },
    },
    { headers: { "set-cookie": setTheme(theme) } },
  );
}

/**
 *
 * sets the active theme
 */
export function ThemeSwitch({
  userPreference,
  className,
}: {
  userPreference?: Theme | null;
  className?: string;
}) {
  const fetcher = useFetcher<typeof action>();

  const requestInfo = useRequestInfo();

  const navigation = useNavigation();

  const optimisticMode = useOptimisticThemeMode();

  const mode = optimisticMode ?? userPreference ?? "system";

  const { handleSubmit, register, reset } = useRemixForm<FormData>({
    mode: "onSubmit",
    fetcher,
    resolver,
    defaultValues: {
      intent: "update",
      redirectTo: undefined,
      theme: undefined,
    },
  });

  const nextMode =
    mode === "system" ? "light" : mode === "light" ? "dark" : "system";

  const modeLabel = {
    light: (
      <Icon name="sun">
        <span className="sr-only">Light</span>
      </Icon>
    ),
    dark: (
      <Icon name="moon">
        <span className="sr-only">Dark</span>
      </Icon>
    ),
    system: (
      <Icon name="laptop">
        <span className="sr-only">System</span>
      </Icon>
    ),
  };

  return (
    <>
      <Form
        method="POST"
        onSubmit={handleSubmit}
        action="/resources/theme-switch"
      >
        <ServerOnly>
          {() => (
            <input type="hidden" name="redirectTo" value={requestInfo.path} />
          )}
        </ServerOnly>

        <input type="hidden" {...register("intent")} />
        <input type="hidden" {...register("theme")} defaultValue={nextMode} />

        <div>
          <button
            type="submit"
            className={className}
            onClick={() => reset()}
            disabled={navigation.state === "submitting"}
          >
            {modeLabel[mode]}
          </button>
        </div>
      </Form>
    </>
  );
}
