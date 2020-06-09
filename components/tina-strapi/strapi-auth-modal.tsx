import {
  Modal,
  ModalActions,
  ModalBody,
  ModalHeader,
  ModalPopup,
  useCMS,
} from "tinacms";

import { StyleReset } from "@tinacms/styles";

export interface StrapiAuthenticationModalProps {
  onAuthSuccess(): void;
  close(): void;
}

export function StrapiAuthenticationModal() {
  const cms = useCMS();

  return (
    <ModalBuilder
      title="Strapi Authentication"
      message="Please login with your Strapi account."
      close={close}
      actions={[{ name: "Cancel", action: close }]}
    ></ModalBuilder>
  );
}

interface ModalBuilderProps {
  title: string;
  message: string;
  actions: any[];
  close(): void;
}

export function ModalBuilder(modalProps: ModalBuilderProps) {
  return (
    <StyleReset>
      <Modal>
        <ModalPopup>
          <ModalHeader close={modalProps.close}>{modalProps.title}</ModalHeader>
          <ModalBody>
            <p>{modalProps.message}</p>
          </ModalBody>
          <ModalActions></ModalActions>
        </ModalPopup>
      </Modal>
    </StyleReset>
  );
}
