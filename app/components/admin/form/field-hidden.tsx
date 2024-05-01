interface PropTypes {
    name: string
    value: string
}

export const AdminFormFieldHidden = ({name, value}:PropTypes) => {
    return(
        <input type="hidden" name={name} value={value} />
    )
}