import { useState } from "react";
import styled from "styled-components";
import { Form, Input, Divider, Button } from "antd";
import bg from "./bg.jpg";

function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  function onFormComplete(values) {
    console.log(values);
    setIsLoading(!isLoading);
  }

  return (
    <Layout>
      <FormContainer isLoading={isLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFormComplete}
          requiredMark={false}
        >
          <h2>ARGUS LOGGER</h2>
          <Divider />
          <Form.Item
            label="Email Address*"
            name="email"
            rules={[
              {
                required: true,
                message: "Pls enter a valid email address",
                type: "email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password*"
            name="password"
            rules={[
              {
                required: true,
                message: "Password is required",
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Divider />
          <Button loading={isLoading} htmlType="submit">
            {!isLoading ? "Login" : "Signing in..."}
          </Button>
        </Form>
      </FormContainer>
    </Layout>
  );
}

export default Auth;

const Layout = styled.div`
  background-size: cover;
  font-family: DM Sans;
  font-size: 14px;
  background-image: url(${bg});
`;

const FormContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  h2 {
    text-align: center;
    font-weight: bold;
  }

  form {
    background: #fff;
    width: 400px;
    padding: 1rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;

    label {
      text-transform: uppercase;
      font-weight: bold;
      font-size: 12px;
    }

    button {
      display: block;
      width: 100%;
      background-color: #48bb78 !important;
      color: #fff !important;
      border: none;
      outline: none;
      padding: 6px 10px 6px 10px;
      cursor: ${({ isLoading }) =>
        isLoading ? "not-allowed" : "pointer"} !important;
    }
  }
`;
