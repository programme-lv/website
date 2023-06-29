type DangerButtonProps = {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

export default function DangerButton(props:DangerButtonProps) {
    return (
		<button onClick={props.onClick} disabled={props.disabled} className="rounded self-end p-2 px-12 text-sm border max-w-xs bg-red-600 text-white font-semibold hover:bg-red-500">
            {props.text}
        </button>
    )
}