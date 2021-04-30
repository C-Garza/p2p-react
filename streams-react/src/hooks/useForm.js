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
  const resetForm = () => {
    setValues(init);
  };
  const clearForm = () => {
    let newValues = {...values};
    Object.keys(newValues).map(key => newValues[key] = "");
    setValues(newValues);
  };

  return {
    values,
    handleChange,
    resetForm,
    clearForm
  };
};