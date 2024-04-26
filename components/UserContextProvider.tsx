"use client";
import { graphql } from "@/gql";
import { User } from "@/gql/graphql";
import { AuthContext } from "@/lib/AuthContext";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useReducer, useState } from "react";

const logoutQueryGQL = graphql(`
mutation Logout {
	logout
}
`);

type UserProp = User | null;

export default function UserContextProvider({ user, children }: {
	user: UserProp, children: any
}) {
	const [userState, setUser] = useState<UserProp>(user);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [authError, setAuthError] = useState<Error | null>(null);

	const [logoutMutation] = useMutation(logoutQueryGQL)
	const router = useRouter();

	function logout() {
		setIsLoading(true);
		logoutMutation().then(() => {
			setUser(null);
			router.push("/");
			notifications.show({
				title: "Visu labu! 🚪",
				message: "Jūs esat veiksmīgi izgājuši no sistēmas.",
				color: "green",
			})
		}).catch(err => {
			setAuthError(err);
		}).finally(() => {
			setIsLoading(false);
		});
	}

	function login(user: User) {
		setUser(user);
	}

	return (
		<AuthContext.Provider value={{
			user: userState,
			loading: isLoading,
			error: authError,
			logout: logout,
			login: login
		}}>
			{children}
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