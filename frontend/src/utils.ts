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

export const generateTimeOptions = () => {
  const times = [];
  for (let hour = 8; hour < 16; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
      times.push(time);
    }
  }
  const time = "16:00";
  times.push(time);
  return times;
};

export const validateTimeOrder = (
  pickupStart: string,
  pickupEnd: string,
  deliveryStart: string,
  deliveryEnd: string
) => {
  const parseTime = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    return new Date(0, 0, 0, hour, minute);
  };

  const pickupStartTime = parseTime(pickupStart);
  const pickupEndTime = parseTime(pickupEnd);
  const deliveryStartTime = parseTime(deliveryStart);
  const deliveryEndTime = parseTime(deliveryEnd);

  if (pickupStartTime >= pickupEndTime) {
    return "Pickup start time must be earlier than pickup end time";
  }
  if (deliveryStartTime >= deliveryEndTime) {
    return "Delivery start time must be earlier than delivery end time";
  }
  if (pickupStartTime >= deliveryEndTime) {
    return "Pickup start time must be earlier than delivery end time";
  }
  return true;
};

export const formatAccountType = (accountType: string): string => {
  return accountType.replace("AccountType.", "").toLowerCase();
};
