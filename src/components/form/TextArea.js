const TextArea = ({
    name,
    title,
    value,
    onChange,
    rows = 4,
    required,
    errorMsg,
    onBlur,
    isblurred,
}) => {

    const showError = required && (!value || value.trim() === "");

    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label">
                {title}
            </label>

            <textarea
                className="form-control"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                required={required}
                onBlur={onBlur}
            />

            <div className={showError && isblurred ? "text-danger" : "d-none"}>
                {errorMsg}
            </div>
        </div>
    );
};

export default TextArea;

