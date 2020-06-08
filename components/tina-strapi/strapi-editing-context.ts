import React from "react";

export interface StrapiEditingProps {
  editMode: boolean;
  enterEditMode: () => void;
  exitEditMode: () => void;
}

export const StrapiEditingContext = React.createContext<StrapiEditingProps | null>(
  null
);
