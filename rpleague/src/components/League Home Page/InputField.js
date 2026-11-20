function InputField({ label, type, id, placeholder }) {
  let panel;
  if (placeholder === "Password") {
    panel = <small id="passwordHelp" class="form-text text-muted">Your password must be greater than 8 characters and contain at least 1 number.</small>;
  } else {
    panel = <div></div>;
  }
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input type={type} className="form-control" id={id} placeholder={placeholder} />
      {panel}
    </div>
  );
}

export default InputField;