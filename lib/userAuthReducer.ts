import { User } from "@/gql/graphql";


export type userAuthReducerAction = {
	type: 'login',
	user: User
} | {
	type: 'logout'
}

export default function userAuthReducer(user:User|null, action: userAuthReducerAction) {
	switch (action.type) {
		case 'login': {
			return action.user;
		}
		case 'logout': {
			return null;
		}
	}
}
