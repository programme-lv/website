/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const subscribe = /* GraphQL */ `subscription Subscribe($name: String!) {
  subscribe(name: $name) {
    name
    data
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.SubscribeSubscriptionVariables,
  APITypes.SubscribeSubscription
>;
