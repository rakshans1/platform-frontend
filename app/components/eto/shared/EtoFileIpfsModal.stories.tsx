import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Container } from "reactstrap";

import { withModalBody } from "../../../utils/storybookHelpers";
import { EtoFileIpfsModalComponent } from "./EtoFileIpfsModal";

const data = {
  isOpen: true,
  onContinue: () => {},
  onDismiss: () => {},
};

storiesOf("ETO/FileIPFSModal", module)
  .addDecorator(withModalBody("47.5rem"))
  .add("default", () => (
    <Container>
      <EtoFileIpfsModalComponent {...data} />
    </Container>
  ));
