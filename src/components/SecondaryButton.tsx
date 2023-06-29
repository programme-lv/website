type PrimaryButtonProps = {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

export default function SecondaryButton(props:PrimaryButtonProps) {
    return (
		<button onClick={props.onClick} disabled={props.disabled} className="rounded self-end p-2 px-12 text-sm border max-w-xs bg-green-600 text-white font-semibold hover:bg-green-500">
            {props.text}
        </button>
    )
}