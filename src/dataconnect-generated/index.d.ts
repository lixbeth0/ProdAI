import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateNewGoalData {
  goal_insert: Goal_Key;
}

export interface CreateNewGoalVariables {
  habitId: UUIDString;
  name: string;
  targetValue: number;
  targetUnit: string;
  startDate: DateString;
  endDate: DateString;
  status: string;
  description?: string | null;
}

export interface GetMyGoalsData {
  goals: ({
    id: UUIDString;
    name: string;
    targetValue: number;
    targetUnit: string;
    startDate: DateString;
    endDate: DateString;
    status: string;
    habit: {
      name: string;
      category: string;
    };
  } & Goal_Key)[];
}

export interface Goal_Key {
  id: UUIDString;
  __typename?: 'Goal_Key';
}

export interface HabitLog_Key {
  id: UUIDString;
  __typename?: 'HabitLog_Key';
}

export interface Habit_Key {
  id: UUIDString;
  __typename?: 'Habit_Key';
}

export interface ListAllHabitsData {
  habits: ({
    id: UUIDString;
    name: string;
    category: string;
    description?: string | null;
    goalUnit?: string | null;
    targetValue?: number | null;
    frequency?: string | null;
    createdAt: TimestampString;
    user: {
      id: UUIDString;
      username: string;
    } & User_Key;
  } & Habit_Key)[];
}

export interface LogHabitEntryData {
  habitLog_insert: HabitLog_Key;
}

export interface LogHabitEntryVariables {
  habitId: UUIDString;
  value: number;
  notes?: string | null;
}

export interface Recommendation_Key {
  id: UUIDString;
  __typename?: 'Recommendation_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface ListAllHabitsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllHabitsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllHabitsData, undefined>;
  operationName: string;
}
export const listAllHabitsRef: ListAllHabitsRef;

export function listAllHabits(options?: ExecuteQueryOptions): QueryPromise<ListAllHabitsData, undefined>;
export function listAllHabits(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllHabitsData, undefined>;

interface CreateNewGoalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewGoalVariables): MutationRef<CreateNewGoalData, CreateNewGoalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewGoalVariables): MutationRef<CreateNewGoalData, CreateNewGoalVariables>;
  operationName: string;
}
export const createNewGoalRef: CreateNewGoalRef;

export function createNewGoal(vars: CreateNewGoalVariables): MutationPromise<CreateNewGoalData, CreateNewGoalVariables>;
export function createNewGoal(dc: DataConnect, vars: CreateNewGoalVariables): MutationPromise<CreateNewGoalData, CreateNewGoalVariables>;

interface GetMyGoalsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyGoalsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyGoalsData, undefined>;
  operationName: string;
}
export const getMyGoalsRef: GetMyGoalsRef;

export function getMyGoals(options?: ExecuteQueryOptions): QueryPromise<GetMyGoalsData, undefined>;
export function getMyGoals(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyGoalsData, undefined>;

interface LogHabitEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogHabitEntryVariables): MutationRef<LogHabitEntryData, LogHabitEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LogHabitEntryVariables): MutationRef<LogHabitEntryData, LogHabitEntryVariables>;
  operationName: string;
}
export const logHabitEntryRef: LogHabitEntryRef;

export function logHabitEntry(vars: LogHabitEntryVariables): MutationPromise<LogHabitEntryData, LogHabitEntryVariables>;
export function logHabitEntry(dc: DataConnect, vars: LogHabitEntryVariables): MutationPromise<LogHabitEntryData, LogHabitEntryVariables>;

