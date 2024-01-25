import renderMD from "@/lib/render";

export default async function MDDiv(props: any) {
    return (
        <span dangerouslySetInnerHTML={{ __html: props.children }} >
        </span>
    );
}
