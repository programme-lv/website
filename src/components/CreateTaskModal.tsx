import { gql, useMutation } from "@apollo/client"
import apolloClient from '@/lib/apolloClient';
import { useState } from "react";
import { Dialog, TextField, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";
const CREATE_TASK = gql`
mutation CreateTask($id: String!, $fullName: String!){
    createTask(id: $id, fullName: $fullName) {
        id
        fullName
        origin
        authors
    }
}
`

type CreateTaskModalProps = {
    open: boolean;
    handleClose: () => void;
}

// redirects to created task after success
export default function CreateTaskDialog(props: CreateTaskModalProps) {
    const {t} = useTranslation('errors')
    const [createTask] = useMutation(CREATE_TASK, { client: apolloClient })

    const [newTaskId, setNewTaskId] = useState<string>("")
    const [newTaskFullName, setNewTaskFullName] = useState<string>("")

    useEffect(() => {
        setNewTaskFullName(newTaskId)
    }, [newTaskId])

    const [taskIsBeingCreated, setTaskIsBeingCreated] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)

    async function handleCreateTask() {
        setTaskIsBeingCreated(true);
        try {
            let response = await createTask({ variables: { id: newTaskId, fullName: newTaskFullName } })
            if (response.data.createTask) {
                console.log(response.data.createTask);
            }
            setSuccess(true);
        } catch (e: any) {
            setError(e.message ?? "nezināma kļūda")
        }
        setTaskIsBeingCreated(false);
    }

    async function clearFormAndClose() {
        props.handleClose();
        setNewTaskId("");
        setError(null);
        setSuccess(false);
    }

    return (
        <Dialog open={props.open} onClose={clearFormAndClose}>
            <DialogTitle>Jauna uzdevuma izveide</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Norādiet jaunā uzdevuma &quot;kodu&quot;.
                    Katram uzdevumam ir unikāls &quot;kods&quot; jeb ID, ko pēc izveides nevar mainīt.
                    Uzdevuma nosaukums ir atsevišķs lauks, ko var mainīt pēc izveides.
                </DialogContentText>
                <TextField autoFocus margin="normal" id="id" label="Uzdevuma kods (ID)" type="text" fullWidth onChange={(e) => setNewTaskId(e.target.value)} />
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
