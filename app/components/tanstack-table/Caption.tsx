import PropTypes from "prop-types";
import { PropsWithChildren } from "react";

export const Caption: React.FC<PropsWithChildren> = ({ children }) => {
  Caption.propTypes = {
    children: PropTypes.any
  };
  return (
    <caption className="bg-white p-5 text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
      {children}
    </caption>
  );
};
