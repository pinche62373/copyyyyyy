import type { RefObject } from "react";
import React from "react";
import {
  Modal as AriaModal,
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  ModalOverlay,
} from "react-aria-components";
import { cn } from "#app/utils/lib/cn";

interface ConfirmProps {
  children: React.ReactNode;
  disabled?: boolean;
}

const Confirm = ({ children, disabled, ...rest }: ConfirmProps) => {
  return (
    <DialogTrigger {...rest}>
      <Button
        className={
          disabled === true ? "opacity-50 cursor-not-allowed" : undefined
        }
        isDisabled={disabled}
      >
        {children}
      </Button>
    </DialogTrigger>
  );
};

interface TriggerProps extends ConfirmProps {
  className?: string;
}

const Trigger = ({ className, children, ...rest }: TriggerProps) => {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
};

interface ModalProps extends TriggerProps {
  heading: string;
  formRef: RefObject<HTMLFormElement>;
}

const Modal = ({ heading, formRef, children, ...rest }: ModalProps) => {
  return (
    <ModalOverlay
      isDismissable
      className={cn(
        "clear-both fixed inset-y-0 start-0 z-[100]",
        "overflow-y-auto flex h-screen w-screen min-h-full",
        "items-start justify-center p-4 text-center",
        "bg-black/75 backdrop-blur",
        "dark:bg-background backdrop-blur-none",
      )}
      {...rest}
    >
      <AriaModal
        className={({ isEntering, isExiting }) => `
          w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl mt-40 dark:bg-foreground dark:shadow-none
          ${isEntering ? "animate-in zoom-in-95 ease-out duration-300" : ""}
          ${isExiting ? "animate-out zoom-out-95 ease-in duration-200" : ""}
        `}
      >
        <Dialog role="alertdialog" className="outline-none relative">
          {({ close }) => {
            return (
              <>
                <Heading
                  slot="title"
                  className="mb-5 text-lg font-semibold text-gray-800 dark:text-neutral-200"
                >
                  {heading}
                </Heading>

                {/* BODY */}
                <p className="mb-7 text-wrap text-sidebar-primary">
                  {children}
                </p>

                {/* BUTTONS */}
                <div className="flex items-center justify-end gap-x-2 px-4 dark:border-neutral-800">
                  <button
                    type="button"
                    slot="close"
                    onClick={close}
                    className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    slot="submit"
                    onClick={() => {
                      close(); // close modal
                      formRef.current && // submit form
                        formRef.current.dispatchEvent(
                          new Event("submit", {
                            cancelable: true,
                            bubbles: true,
                          }),
                        );
                    }}
                    className="inline-flex items-center gap-x-2 rounded-lg border-none bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Confirm
                  </button>
                </div>
              </>
            );
          }}
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  );
};

Confirm.Trigger = Trigger;
Confirm.Modal = Modal;

export { Confirm };
