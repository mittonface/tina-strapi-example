import { Field, Form } from "react-final-form";
import {
  Modal,
  ModalActions,
  ModalBody,
  ModalHeader,
  ModalPopup,
  useCMS,
} from "tinacms";

import { AsyncButton } from "./AsyncButton";
import { Input } from "@tinacms/fields";
import { StyleReset } from "@tinacms/styles";
import { TinaStrapiClient } from "./tina-strapi-client";

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
        onSubmit={async (values: LoginFormFieldProps) => {
          const authStatus = await strapi
            .authenticate(values.username, values.password)
            .then(() => {
              alert("success");
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
}

export function StrapiLoginForm({ onSubmit, close }: LoginFormProps) {
  return (
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
