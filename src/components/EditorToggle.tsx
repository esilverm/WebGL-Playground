import classnames from 'classnames';
import React from 'react';
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
interface Props {
  open: boolean;
  onClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditorToggle: React.FC<Props> = ({ open, onClick }) => {
  return (
    <div
      className={classnames(
        'p-1 rounded-lg border-2 border-transparent cursor-pointer',
        {
          'absolute bottom-0 right-0 mx-6 my-4 hover:border-gray-300': open,
          'fixed bottom-0 left-0 m-6 hover:border-gray-600': !open,
        }
      )}
      onClick={() => onClick((lastState) => !lastState)}
    >
      {open ? (
        <FiChevronsLeft stroke="rgba(209, 213, 219, 1)" size="32" />
      ) : (
        <FiChevronsRight stroke="rgba(55, 65, 81, 1)" size="32" />
      )}
    </div>
  );
};
