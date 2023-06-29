type PrimaryButtonProps = {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

export default function PrimaryButton(props:PrimaryButtonProps) {
    return (
		<button onClick={props.onClick} disabled={props.disabled} className="rounded self-end p-2 px-12 text-sm border max-w-xs bg-blue-600 text-white font-semibold hover:bg-blue-500">
            {props.text}
        </button>
    )
}