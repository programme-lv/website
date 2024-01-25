import renderMD from "@/lib/render";

export function MDDiv(props: any) {
    return (
        <span dangerouslySetInnerHTML={{ __html: renderMD(props.children) }} >
        </span>
    );
}
