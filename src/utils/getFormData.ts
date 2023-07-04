export const getFormData = (formElement: any) => {
  const formData = new FormData(formElement);

  const values = [...formData.values()];
  const isEmpty = values.includes('');

  const data = Object.fromEntries(formData.entries());
  return { isEmpty, data };
};
