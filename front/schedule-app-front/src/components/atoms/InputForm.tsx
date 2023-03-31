import { Input, InputGroup, InputLeftAddon, Text } from "./index";
import React, { ChangeEvent, FC, memo } from "react";
import {
  DeepMap,
  FieldError,
  FieldValues,
  useFormContext,
} from "react-hook-form";

type Props = {
  name: string;
  title: string;
  type: string;
  value?: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  message: string;
  isReadOnly?: boolean;
  width?: string;
};

const InputForm: FC<Props> = memo((props) => {
  const { name, title, type, value, handleChange, message, isReadOnly, width } =
    props;
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <InputGroup>
        <InputLeftAddon children={title} bg="cyan.600" color="white" />
        <Input
          value={value}
          {...register(`${name}`, {
            required: `${message}`,
            onChange: (e) => handleChange(e),
          })}
          id={name}
          name={name}
          placeholder={title}
          type={type}
          isReadOnly={isReadOnly}
          disabled={isReadOnly}
          width={width}
        />
      </InputGroup>
      {errors[title] && (
        <Text>{`${
          (errors[title] as DeepMap<FieldValues, FieldError>).message
        }`}</Text>
      )}
    </>
  );
});

export default InputForm;
