import React from "react";

import { StrapiEditingContext } from "./strapi-editing-context";

export function useStrapiEditing() {
  return React.useContext(StrapiEditingContext);
}
