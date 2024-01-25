import { graphql } from "@/gql"
import { getClient } from "@/lib/client";

const queryListLanguagesGQL = graphql(`
query ListLanguages {
    listLanguages(enabled: true) {
        id
        fullName
        monacoID
        enabled
    }
}`)

export default async function queryLanguages() {
    "use server"
    const client = getClient();
    const { data } = await client.query({
        query: queryListLanguagesGQL,
    });

    return data.listLanguages;
}