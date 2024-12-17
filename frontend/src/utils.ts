import { get } from "http";

export const emailPatter = {
  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  message: "Invalid email",
};

export const namePattern = {
  value: /^[a-zA-Z]+$/,
  message: "Invalid name",
};

export const passwordPattern = {
  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  message: "Password must have at least 8 characters",
};

export const phonePattern = {
  value: /^\d{9}$/,
  message: "Invalid phone number",
};

export const passwordRules = (isRequired = true) => {
  const rules: any = {
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters long",
    },
  };

  if (isRequired) {
    rules.required = "Password is required";
  }

  return rules;
};

export const confirmPasswordRules = (
  getValues: () => any,
  isRequired = true
) => {
  const rules: any = {
    validate: (value: string) => {
      const password = getValues().password || getValues().new_password;
      return value === password ? true : "The passwords do not match";
    },
  };

  if (isRequired) {
    rules.required = "Password confirmation is required";
  }

  return rules;
};
