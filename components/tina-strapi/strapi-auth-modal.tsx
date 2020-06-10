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
import { StyleReset } from "@tinacms/styles";
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
      message="Please login with your Strapi account."
      close={close}
      actions={[]}
    >
      <StrapiLoginForm
        close={close}
        onSuccess={onAuthSuccess}
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
      ></StrapiLoginForm>
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
  onSuccess(): void;
}

export function StrapiLoginForm({
  onSubmit,
  close,
  onSuccess,
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
                  <input {...input} />
                </div>
              )}
            ></Field>
            <Field
              name="password"
              render={({ input, meta }) => (
                <div>
                  <input type="password" {...input} />
                </div>
              )}
            ></Field>
            <button onClick={close}>Close</button>
            <button type="submit">Submit</button>
          </form>
        )}
      ></Form>
      <button onClick={() => startGithubAuth(onSuccess)}>
        Login with GitHub
      </button>
    </>
  );
}
export function startGithubAuth(onSuccess) {
  let authTab: Window | undefined;
  const previousCookie = Cookies.get(STRAPI_JWT);

  window.setInterval(() => {
    const currentCookie = Cookies.get(STRAPI_JWT);
    console.log(previousCookie);
    console.log(currentCookie);
    if (currentCookie && currentCookie != previousCookie) {
      authTab.close();
      onSuccess();
    }
  }, 1000);

  authTab = popupWindow(
    STRAPI_URL + "/connect/github",
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
          <ModalBody>
            <p>{modalProps.message}</p>
            {modalProps.children}
          </ModalBody>
          <ModalActions>
            {modalProps.actions.map((action: any) => {
              return <AsyncButton {...action} />;
            })}
          </ModalActions>
        </ModalPopup>
      </Modal>
    </StyleReset>
  );
}
