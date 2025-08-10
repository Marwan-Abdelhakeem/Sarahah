export const validate = (schema) => (req, res, next) => {
  let data = { ...req.body, ...req.params, ...req.query };
  const { error } = schema.validate(data, { abortEarly: false });

  if (error) {
    req.flash("error", error.details.map(({ message }) => message).join(", "));
    return res.redirect(req.get("Referer") || "/");
  }
  next();
};
