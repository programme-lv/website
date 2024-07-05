/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Channel = {
  __typename: "Channel",
  name: string,
  data: string,
};

export type PublishMutationVariables = {
  name: string,
  data: string,
};

export type PublishMutation = {
  publish?:  {
    __typename: "Channel",
    name: string,
    data: string,
  } | null,
};

export type GetChannelQueryVariables = {
};

export type GetChannelQuery = {
  getChannel?:  {
    __typename: "Channel",
    name: string,
    data: string,
  } | null,
};

export type SubscribeSubscriptionVariables = {
  name: string,
};

export type SubscribeSubscription = {
  subscribe?:  {
    __typename: "Channel",
    name: string,
    data: string,
  } | null,
};
