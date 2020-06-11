import { TinaCMS, TinaProvider } from "tinacms";

import { StrapiProvider } from "../components/tina-strapi/strapi-provider";
import { TinaStrapiClient } from "../components/tina-strapi/tina-strapi-client";
import { useStrapiEditing } from "../components/tina-strapi/use-strapi-editing";

export default function MyApp({ Component, pageProps }) {
  const cms = new TinaCMS({
    sidebar: { hidden: true },
    apis: {
      strapi: new TinaStrapiClient(),
    },
  });

  if (pageProps.preview) {
    cms.enable();
  } else {
    cms.disable();
  }
  return (
    <TinaProvider cms={cms}>
      <StrapiProvider
        editMode={pageProps.preview}
        enterEditMode={enterEditMode}
        exitEditMode={exitEditMode}
      >
        <EditButton editMode={pageProps.preview} />
        <Component {...pageProps} />
      </StrapiProvider>
    </TinaProvider>
  );
}

export interface EditButtonProps {
  editMode: boolean;
}

export const EditButton = ({ editMode }: EditButtonProps) => {
  const strapi = useStrapiEditing();
  return (
    <button onClick={editMode ? strapi.exitEditMode : strapi.enterEditMode}>
      {editMode ? "Stop Editing" : "Edit This Site"}
    </button>
  );
};

const enterEditMode = () => {
  return fetch(`/api/preview`).then(() => {
    window.location.href = window.location.pathname;
  });
};

const exitEditMode = () => {
  return fetch(`/api/reset-preview`).then(() => {
    window.location.reload();
  });
};
