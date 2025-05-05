interface GeneralError extends Error {
  errors: {
    path: (string | number)[];
    message: string;
  }[];
}

export { GeneralError };
