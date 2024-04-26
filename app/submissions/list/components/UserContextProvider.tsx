"use client";
import { User } from "@/gql/graphql";
import { AuthContext, AuthDispatchContext } from "@/lib/AuthContext";
import userAuthReducer from "@/lib/userAuthReducer";
import { useReducer } from "react";

type UserProp = User | null;
export default function UserContextProvider({ user, children }: {
	user: UserProp, children: any
}) {

	const [tasks, dispatch] = useReducer(userAuthReducer, user);

	return (
		<AuthContext.Provider value={{ user: user }}>
			<AuthDispatchContext.Provider value={dispatch}>
				{children}
			</AuthDispatchContext.Provider>
		</AuthContext.Provider>
	);

}
/*

  function handleAddTask(text) {
	dispatch({
	  type: 'added',
	  id: nextId++,
	  text: text,
	});
  }

  function handleChangeTask(task) {
	dispatch({
	  type: 'changed',
	  task: task
	});
  }

  function handleDeleteTask(taskId) {
	dispatch({
	  type: 'deleted',
	  id: taskId
	});
  }
*/

/*
function tasksReducer(tasks, action) {
  switch (action.type) {
	case 'added': {
	  return [...tasks, {
		id: action.id,
		text: action.text,
		done: false
	  }];
	}
	case 'changed': {
	  return tasks.map(t => {
		if (t.id === action.task.id) {
		  return action.task;
		} else {
		  return t;
		}
	  });
	}
	case 'deleted': {
	  return tasks.filter(t => t.id !== action.id);
	}
	default: {
	  throw Error('Unknown action: ' + action.type);
	}
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
*/