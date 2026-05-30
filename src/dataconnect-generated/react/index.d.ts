import { ListAllHabitsData, CreateNewGoalData, CreateNewGoalVariables, GetMyGoalsData, LogHabitEntryData, LogHabitEntryVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListAllHabits(options?: useDataConnectQueryOptions<ListAllHabitsData>): UseDataConnectQueryResult<ListAllHabitsData, undefined>;
export function useListAllHabits(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllHabitsData>): UseDataConnectQueryResult<ListAllHabitsData, undefined>;

export function useCreateNewGoal(options?: useDataConnectMutationOptions<CreateNewGoalData, FirebaseError, CreateNewGoalVariables>): UseDataConnectMutationResult<CreateNewGoalData, CreateNewGoalVariables>;
export function useCreateNewGoal(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewGoalData, FirebaseError, CreateNewGoalVariables>): UseDataConnectMutationResult<CreateNewGoalData, CreateNewGoalVariables>;

export function useGetMyGoals(options?: useDataConnectQueryOptions<GetMyGoalsData>): UseDataConnectQueryResult<GetMyGoalsData, undefined>;
export function useGetMyGoals(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyGoalsData>): UseDataConnectQueryResult<GetMyGoalsData, undefined>;

export function useLogHabitEntry(options?: useDataConnectMutationOptions<LogHabitEntryData, FirebaseError, LogHabitEntryVariables>): UseDataConnectMutationResult<LogHabitEntryData, LogHabitEntryVariables>;
export function useLogHabitEntry(dc: DataConnect, options?: useDataConnectMutationOptions<LogHabitEntryData, FirebaseError, LogHabitEntryVariables>): UseDataConnectMutationResult<LogHabitEntryData, LogHabitEntryVariables>;
