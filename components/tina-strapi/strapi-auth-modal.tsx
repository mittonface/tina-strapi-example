import {
  Modal,
  ModalActions,
  ModalBody,
  ModalHeader,
  ModalPopup,
  useCMS,
} from "tinacms";

import { AsyncButton } from "./AsyncButton";
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
      actions={[
        { name: "Cancel", action: close },
        {
          name: "Log In",
          action: () => {
            alert("It is a good day to login");
          },
        },
      ]}
    >
      <input type="text"></input>
      <input type="password"></input>
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
