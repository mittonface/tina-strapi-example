import { Button, StyleReset } from "@tinacms/styles";
import { Field, Form } from "react-final-form";
import {
  Modal,
  ModalActions,
  ModalBody,
  ModalHeader,
  ModalPopup,
  useCMS,
} from "tinacms";
import { STRAPI_JWT, STRAPI_URL, TinaStrapiClient } from "./tina-strapi-client";

import { AsyncButton } from "./AsyncButton";
import Cookies from "js-cookie";
import { Input } from "@tinacms/fields";
import popupWindow from "./popupWindow";

export interface StrapiAuthenticationModalProps {
  onAuthSuccess(): void;
  close(): void;
}

export function StrapiAuthenticationModal({
  onAuthSuccess,
  close,
}: StrapiAuthenticationModalProps) {
  const cms = useCMS();
  const strapi: TinaStrapiClient = cms.api.strapi;

  return (
    <ModalBuilder
      title="Strapi Authentication"
      message="Login with your Strapi account."
      close={close}
      actions={[]}
    >
      <StrapiLoginForm
        close={close}
        onAuthSuccess={onAuthSuccess}
        onSubmit={async (values: LoginFormFieldProps) => {
          const authStatus = await strapi
            .authenticate(values.username, values.password)
            .then((authData) => {
              Cookies.set(STRAPI_JWT, authData.data.jwt);
              onAuthSuccess();
            })
            .catch(() => {
              alert("failure");
            });
        }}
      />
      <hr />
      <div className="providerLogins">
        Login with one of the following providers.
        <div className="providerButtons">
          <button
            onClick={() =>
              startProviderAuth({ provider: "github", onAuthSuccess })
            }
          >
            GitHub
          </button>
          <button
            onClick={() =>
              startProviderAuth({ provider: "google", onAuthSuccess })
            }
          >
            Google
          </button>
        </div>
      </div>
    </ModalBuilder>
  );
}

interface ModalBuilderProps {
  title: string;
  message: string;
  actions: any[];
  close(): void;
  children?: any;
}

interface LoginFormFieldProps {
  username: string;
  password: string;
}

interface LoginFormProps {
  onSubmit(values: LoginFormFieldProps): void;
  close(): void;
  onAuthSuccess(): void;
}

export function StrapiLoginForm({
  onSubmit,
  close,
  onAuthSuccess,
}: LoginFormProps) {
  return (
    <>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="username"
              render={({ input, meta }) => (
                <div>
                  <Input {...input} />
                </div>
              )}
            ></Field>
            <Field
              name="password"
              render={({ input, meta }) => (
                <div>
                  <Input type="password" {...input} />
                </div>
              )}
            ></Field>
            <ModalActions>
              <Button onClick={close}>Close</Button>
              <Button primary type="submit">
                Submit
              </Button>
            </ModalActions>
          </form>
        )}
      ></Form>
    </>
  );
}

interface ProviderAuthProps {
  provider: string;
  onAuthSuccess(): void;
}

export function startProviderAuth({
  provider,
  onAuthSuccess,
}: ProviderAuthProps) {
  let authTab: Window | undefined;
  const previousCookie = Cookies.get(STRAPI_JWT);

  // poll the cookie value for a change. close the auth window on change
  // there are no native JS events that support this behaviour
  window.setInterval(() => {
    const currentCookie = Cookies.get(STRAPI_JWT);
    if (currentCookie && currentCookie != previousCookie) {
      authTab.close();
      onAuthSuccess();
    }
  }, 1000);

  authTab = popupWindow(
    STRAPI_URL + `/connect/${provider}`,
    "_blank",
    window,
    1000,
    700
  );
}

export function ModalBuilder(modalProps: ModalBuilderProps) {
  return (
    <StyleReset>
      <Modal>
        <ModalPopup>
          <ModalHeader close={modalProps.close}>{modalProps.title}</ModalHeader>
          <ModalBody padded>
            <p>{modalProps.message}</p>
            {modalProps.children}
          </ModalBody>
        </ModalPopup>
      </Modal>
    </StyleReset>
  );
}
