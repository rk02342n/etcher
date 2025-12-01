import { forwardRef } from "react";

const Input = forwardRef(({
    name,
    title,
    type,
    className,
    value,
    onChange,
    placeholder,
    autoComplete,
    // errorDiv,
    errorMsg,
    required,
    onBlur,
    isblurred,
}, ref) => {

    const showError = required && (!value || value.trim() === "");

    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label">
                {title || name}
            </label>

            <input
                type={type}
                className={className}
                name={name}
                id={name}
                ref={ref}
                placeholder={placeholder}
                onChange={onChange}
                autoComplete={autoComplete}
                value={value}
                required={required}
                onBlur={onBlur}
            />

            <div className={showError && isblurred ? "text-danger p-10" : "d-none p-10"}>
                {errorMsg}
            </div>
        </div>
    );
});

export default Input;
