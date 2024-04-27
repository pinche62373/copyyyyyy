import { createContext } from 'react';

import { t_table } from './types';

export const TableContext = createContext<{
  table?: t_table<any>;
}>({
  table: undefined,
});
