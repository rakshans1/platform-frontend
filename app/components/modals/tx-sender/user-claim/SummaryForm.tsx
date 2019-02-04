import { Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import * as YupTS from "../../../../lib/yup-ts";
import { Button } from "../../../shared/buttons";
import { Form, FormFieldBoolean } from "../../../shared/forms";

const getSummaryFormSchema = () =>
  YupTS.object({
    readDocuments: YupTS.onlyTrue(),
  }).toYup();

interface IExternalProps {
  onSubmit: () => void;
}

const SummaryForm: React.FunctionComponent<IExternalProps> = ({ onSubmit }) => (
  <Formik<any>
    validationSchema={getSummaryFormSchema()}
    isInitialValid={false}
    initialValues={{}}
    onSubmit={onSubmit}
  >
    {({ isValid }) => {
      return (
        <Form>
          <Container>
            <Row className="justify-content-center">
              <Col xs={12} className="mb-3 d-flex justify-content-center">
                <FormFieldBoolean
                  label={
                    <FormattedMessage id="modals.tx-sender.user-claim-summary.download-confirmation" />
                  }
                  name="readDocuments"
                />
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                <Button
                  disabled={!isValid}
                  className="mt-2"
                  onClick={onSubmit}
                  data-test-id="modals.tx-sender.withdraw-flow.summery.withdrawSummery.accept"
                >
                  <FormattedMessage id="withdraw-flow.confirm" />
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      );
    }}
  </Formik>
);

export { SummaryForm };
