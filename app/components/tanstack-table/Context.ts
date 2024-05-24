import { createContext } from 'react';

import { t_table } from './types';

export const TableContext = createContext<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table?: t_table<any>;
}>({
  table: undefined,
});
