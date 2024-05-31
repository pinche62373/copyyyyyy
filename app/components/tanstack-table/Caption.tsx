import PropTypes from "prop-types";
import { PropsWithChildren } from "react";

export const Caption: React.FC<PropsWithChildren> = ({ children }) => {
  Caption.propTypes = {
    children: PropTypes.any,
  };
  return (
    <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
      {children}
    </caption>
  );
};
