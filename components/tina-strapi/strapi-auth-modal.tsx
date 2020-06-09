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

export interface StrapiAuthenticationModalProps {
  close(): void;
}

export function StrapiAuthenticationModal({
  close,
}: StrapiAuthenticationModalProps) {
  const cms = useCMS();

  return (
    <ModalBuilder
      title="Strapi Authentication"
      message="Please login with your Strapi account."
      close={close}
      actions={[]}
    >
      <StrapiLoginForm
        close={close}
        onSubmit={(values) => {
          alert(JSON.stringify(values));
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

interface LoginFormProps {
  onSubmit(values: any): void;
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
