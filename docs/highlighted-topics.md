# Highlighted topics

The admin task page manages the ordered, at-most-two highlighted topic assignments and their shared catalogue. Assignment is by stable ID, never free text. Retiring an entry prevents new assignments but does not hide or remove existing ones. Both catalogue edits and task assignments use backend revisions; on a conflict the editor asks for an explicit refresh, which discards unsaved selections. Backend validation remains authoritative for IDs and labels.

The server actions forward the signed-in administrator's cookie, not the shared backend API key. Admin and task-list reads bypass the Next.js data cache, so API-key clients need not invalidate it after a write. Successful changes in the editor invalidate the `task-highlights` cache tag on detail requests and the relevant routes, and remove the shared task-list client query.

The UI calls these **Izceltie temati** (highlighted topics), as requested. [Tēzaurs](https://tezaurs.lv/temats) defines *temats* as the subject covered in a text and as a synonym of *tēma*; EuroTermBank's exact approved [topic](https://eurotermbank.com/entry/2903409) translation is *tēma*. The education context motivates the requested *temats*. Record this decision in the project glossary when updating the separate docs repository.

Verify with an admin session: create a catalogue entry, assign two entries, reorder and save; reload the task list, including a task with no origin. Rename and retire an assigned entry, confirm it remains displayed but cannot be newly assigned, then remove and reactivate it. In two sessions provoke a revision conflict and verify the explicit refresh. Public task responses without `highlighted_tags` remain supported.
