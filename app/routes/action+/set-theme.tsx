import { createThemeAction } from "remix-themes";

import { themeSessionResolver } from "#app/utils/theme.server";

export const action = createThemeAction(themeSessionResolver);
