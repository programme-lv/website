'use client';

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { FormEvent, useEffect, useState } from 'react';

// The path of your codegen files. You may need to update this.
import { publish } from '@/graphql/mutations';
import { subscribe } from '@/graphql/subscriptions';

// Your Amplify configuration.
Amplify.configure({
    API: {
        GraphQL: {
            endpoint: 'https://crl6ilhc7rb55lpydzr3zdcggm.appsync-api.eu-central-1.amazonaws.com/graphql',
            region: 'eu-central-1',
            defaultAuthMode: 'apiKey',
            apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY,
        },
    },
});

const client = generateClient();

export default function RealtimeStarterPage() {
    const [data, setData] = useState('');
    const [received, setReceived] = useState('');

    console.log(process.env.NEXT_PUBLIC_APPSYNC_API_KEY);

    // Define the channel name here
    let name = 'robots';

    // Publish data to subscribed clients
    async function handleSubmit(evt:FormEvent) {
        evt.preventDefault();
        if (!data) return;
        await client.graphql({
            query: publish,
            variables: { name, data },
        });
    }

    // subscribe to events
    useEffect(() => {
        const sub = client.graphql({ query: subscribe, variables: { name } }).subscribe({
            next: ({ data }) => setReceived(data.subscribe.data),
            error: (error) => console.warn(error),
        });
        return () => sub.unsubscribe();
    }, [name]);

    useEffect(() => {
        console.log(received);
    }, [received]);

    return (
    <div className="App">
        <header className="App-header">
        <p>Send/Push JSON to channel &quot;{name}&quot;...</p>
        <form onSubmit={handleSubmit}>
            <textarea
            rows={5}
            cols={60}
            name="description"
            onChange={(e) => setData(e.target.value)}
            value={data}
            placeholder="Enter valid JSON here... (use quotes for keys and values)"
            ></textarea>
            <br />
            <input type="submit" value="Submit" />
        </form>
        <p>Subscribed/Listening to channel &quot;{name}&quot;...</p>
        <pre>{!received || JSON.stringify(JSON.parse(received), null, 2)}</pre>
        </header>
    </div>
    );
}