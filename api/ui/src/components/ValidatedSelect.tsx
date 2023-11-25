import { Field } from "formik";
import { Form, InputGroup } from "react-bootstrap";

interface Props extends React.ComponentPropsWithoutRef<"select"> {
    name: string;
    type?: string;
    controlId?: string;
}

export default function (props: Props) {
    return (
        <Field
            name={props.name}
            render={({ field, form }: any) => {
                const isValid = !form.errors[field.name];
                const isInvalid = form.touched[field.name] && !isValid;

                return (
                    <InputGroup>
                        <Form.Select
                            {...field}
                            isValid={form.touched[field.name] && isValid}
                            isInvalid={isInvalid}
                            feedback={form.errors[field.name]}
                            {...props}
                        >
                            {props.children}
                        </Form.Select>

                        <Form.Control.Feedback type="invalid">
                            {form.errors[field.name]}
                        </Form.Control.Feedback>
                    </InputGroup>
                );
            }}
        />
    )
}