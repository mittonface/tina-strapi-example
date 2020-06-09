import { StrapiAuthenticationModal } from "./strapi-auth-modal";
import { StrapiEditingContext } from "./strapi-editing-context";
import { useCMS } from "tinacms";
import { useState } from "react";

interface ProviderProps {
  children: any;
  editMode: boolean;
  enterEditMode: () => void;
  exitEditMode: () => void;
}
export const StrapiProvider = ({
  children,
  editMode,
  enterEditMode,
  exitEditMode,
}: ProviderProps) => {
  const cms = useCMS();
  const [activeModal, setActiveModal] = useState(null);

  const beginAuth = async () => {
    setActiveModal("authenticate");
  };

  const onClose = async () => {
    setActiveModal(null);
  };

  const onAuthSuccess = async () => {
    enterEditMode();
    setActiveModal(null);
  };

  return (
    <StrapiEditingContext.Provider
      value={{ editMode, enterEditMode: beginAuth, exitEditMode }}
    >
      {activeModal === "authenticate" && (
        <StrapiAuthenticationModal
          close={onClose}
          onAuthSuccess={onAuthSuccess}
        />
      )}
      {children}
    </StrapiEditingContext.Provider>
  );
};
