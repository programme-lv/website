/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const publish = /* GraphQL */ `mutation Publish($name: String!, $data: AWSJSON!) {
  publish(name: $name, data: $data) {
    name
    data
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PublishMutationVariables,
  APITypes.PublishMutation
>;
