import { useCMS } from "tinacms";
import { StrapiEditingContext } from "./strapi-editing-context";

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
  const strapi = cms.api.strapi;

  const beginAuth = async () => {
    strapi.authenticate();
    enterEditMode();
  };

  return (
    <StrapiEditingContext.Provider
      value={{ editMode, enterEditMode: beginAuth, exitEditMode }}
    >
      {children}
    </StrapiEditingContext.Provider>
  );
};
