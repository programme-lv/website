import { gql, useMutation } from "@apollo/client"
import apolloClient from '@/lib/apolloClient';
import { useState } from "react";
import { Dialog, TextField, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";
import Router from "next/router";

const CREATE_TASK = gql`
mutation CreateTask($name: String!, $code: String!){
    createTask(name: $name, code: $code) {
        id
        code
        name
        createdAt
        updatedAt
    }
}
`

type CreateTaskModalProps = {
    open: boolean;
    handleClose: () => void;
}

// redirects to created task after success
export default function CreateTaskDialog(props: CreateTaskModalProps) {
    const { t } = useTranslation('errors')
    const [createTask] = useMutation(CREATE_TASK, { client: apolloClient })

    const [newTaskCode, setNewTaskCode] = useState<string>("")
    const [newTaskName, setNewTaskName] = useState<string>("")


    const [taskIsBeingCreated, setTaskIsBeingCreated] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)

    async function handleCreateTask() {
        setTaskIsBeingCreated(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await createTask({ variables: { code: newTaskCode, name: newTaskName } })
            if (response.data.createTask) {
                console.log(response.data.createTask);
            }
            setSuccess(true);
            await Router.push(`/tasks/edit/${newTaskCode}`)
        } catch (e: any) {
            setError(e.message ?? "nezināma kļūda")
        }

        setTaskIsBeingCreated(false);
    }

    async function clearFormAndClose() {
        props.handleClose();
        setNewTaskCode("");
        setNewTaskName("");
        setError(null);
        setSuccess(false);
    }

    return (
        <Dialog open={props.open} onClose={clearFormAndClose}>
            <DialogTitle>Jauna uzdevuma izveide</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Norādiet jaunā uzdevuma &quot;kodu&quot;.
                    Katram uzdevumam ir unikāls, īss &quot;kods&quot; jeb ID.
                    Uzdevuma kods var saturēt tikai mazos latīņu burtus un ciparus.
                </DialogContentText>

                <TextField autoFocus margin="normal" id="code"
                    label="Uzdevuma kods (ID)" type="text" fullWidth
                    onChange={(e) => setNewTaskCode(e.target.value)} />

                <TextField margin="normal" id="name"
                    label="Uzdevuma nosaukums" type="text" fullWidth
                    onChange={(e) => setNewTaskName(e.target.value)} />

                {error && <Alert severity="error">{t(error)}</Alert>}
                {success && <Alert severity="success">Uzdevums izveidots!</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.handleClose()} disabled={taskIsBeingCreated}>Atcelt</Button>
                <LoadingButton loading={taskIsBeingCreated} onClick={handleCreateTask}>Izveidot</LoadingButton>
            </DialogActions>

        </Dialog>
    )
}
