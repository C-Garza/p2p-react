import { useEffect, useState } from "react";

export default function useForm(init = {}) {
  const [values, setValues] = useState(init);
  const initValues = Object.values(init).join("");

  useEffect(() => {
    setValues(init);
  }, [initValues]);

  const handleChange = e => {
    let {value, name} = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };
  const handleAdd = e => {
    let {value, name} = e.target;
    setValues({
      ...values,
      [name]: values[name] + value
    });
  };
  const resetForm = () => {
    setValues(init);
  };
  const clearForm = () => {
    let newValues = {...values};
    Object.keys(newValues).map(key => newValues[key] = "");
    setValues(newValues);
  };
  const clearInput = (name) => {
    setValues(values => ({...values, [name]: ""}));
  };

  return {
    values,
    setValues,
    handleChange,
    handleAdd,
    resetForm,
    clearForm,
    clearInput
  };
};