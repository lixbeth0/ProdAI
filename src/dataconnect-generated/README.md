# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListAllHabits*](#listallhabits)
  - [*GetMyGoals*](#getmygoals)
- [**Mutations**](#mutations)
  - [*CreateNewGoal*](#createnewgoal)
  - [*LogHabitEntry*](#loghabitentry)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListAllHabits
You can execute the `ListAllHabits` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllHabits(options?: ExecuteQueryOptions): QueryPromise<ListAllHabitsData, undefined>;

interface ListAllHabitsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllHabitsData, undefined>;
}
export const listAllHabitsRef: ListAllHabitsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllHabits(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllHabitsData, undefined>;

interface ListAllHabitsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllHabitsData, undefined>;
}
export const listAllHabitsRef: ListAllHabitsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllHabitsRef:
```typescript
const name = listAllHabitsRef.operationName;
console.log(name);
```

### Variables
The `ListAllHabits` query has no variables.
### Return Type
Recall that executing the `ListAllHabits` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllHabitsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListAllHabits`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllHabits } from '@dataconnect/generated';


// Call the `listAllHabits()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllHabits();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllHabits(dataConnect);

console.log(data.habits);

// Or, you can use the `Promise` API.
listAllHabits().then((response) => {
  const data = response.data;
  console.log(data.habits);
});
```

### Using `ListAllHabits`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllHabitsRef } from '@dataconnect/generated';


// Call the `listAllHabitsRef()` function to get a reference to the query.
const ref = listAllHabitsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllHabitsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.habits);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.habits);
});
```

## GetMyGoals
You can execute the `GetMyGoals` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyGoals(options?: ExecuteQueryOptions): QueryPromise<GetMyGoalsData, undefined>;

interface GetMyGoalsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyGoalsData, undefined>;
}
export const getMyGoalsRef: GetMyGoalsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyGoals(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyGoalsData, undefined>;

interface GetMyGoalsRef {
  ...
  (dc: DataConnect): QueryRef<GetMyGoalsData, undefined>;
}
export const getMyGoalsRef: GetMyGoalsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyGoalsRef:
```typescript
const name = getMyGoalsRef.operationName;
console.log(name);
```

### Variables
The `GetMyGoals` query has no variables.
### Return Type
Recall that executing the `GetMyGoals` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyGoalsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMyGoals`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyGoals } from '@dataconnect/generated';


// Call the `getMyGoals()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyGoals();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyGoals(dataConnect);

console.log(data.goals);

// Or, you can use the `Promise` API.
getMyGoals().then((response) => {
  const data = response.data;
  console.log(data.goals);
});
```

### Using `GetMyGoals`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyGoalsRef } from '@dataconnect/generated';


// Call the `getMyGoalsRef()` function to get a reference to the query.
const ref = getMyGoalsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyGoalsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.goals);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.goals);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewGoal
You can execute the `CreateNewGoal` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewGoal(vars: CreateNewGoalVariables): MutationPromise<CreateNewGoalData, CreateNewGoalVariables>;

interface CreateNewGoalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewGoalVariables): MutationRef<CreateNewGoalData, CreateNewGoalVariables>;
}
export const createNewGoalRef: CreateNewGoalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewGoal(dc: DataConnect, vars: CreateNewGoalVariables): MutationPromise<CreateNewGoalData, CreateNewGoalVariables>;

interface CreateNewGoalRef {
  ...
  (dc: DataConnect, vars: CreateNewGoalVariables): MutationRef<CreateNewGoalData, CreateNewGoalVariables>;
}
export const createNewGoalRef: CreateNewGoalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewGoalRef:
```typescript
const name = createNewGoalRef.operationName;
console.log(name);
```

### Variables
The `CreateNewGoal` mutation requires an argument of type `CreateNewGoalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateNewGoal` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewGoalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewGoalData {
  goal_insert: Goal_Key;
}
```
### Using `CreateNewGoal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewGoal, CreateNewGoalVariables } from '@dataconnect/generated';

// The `CreateNewGoal` mutation requires an argument of type `CreateNewGoalVariables`:
const createNewGoalVars: CreateNewGoalVariables = {
  habitId: ..., 
  name: ..., 
  targetValue: ..., 
  targetUnit: ..., 
  startDate: ..., 
  endDate: ..., 
  status: ..., 
  description: ..., // optional
};

// Call the `createNewGoal()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewGoal(createNewGoalVars);
// Variables can be defined inline as well.
const { data } = await createNewGoal({ habitId: ..., name: ..., targetValue: ..., targetUnit: ..., startDate: ..., endDate: ..., status: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewGoal(dataConnect, createNewGoalVars);

console.log(data.goal_insert);

// Or, you can use the `Promise` API.
createNewGoal(createNewGoalVars).then((response) => {
  const data = response.data;
  console.log(data.goal_insert);
});
```

### Using `CreateNewGoal`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewGoalRef, CreateNewGoalVariables } from '@dataconnect/generated';

// The `CreateNewGoal` mutation requires an argument of type `CreateNewGoalVariables`:
const createNewGoalVars: CreateNewGoalVariables = {
  habitId: ..., 
  name: ..., 
  targetValue: ..., 
  targetUnit: ..., 
  startDate: ..., 
  endDate: ..., 
  status: ..., 
  description: ..., // optional
};

// Call the `createNewGoalRef()` function to get a reference to the mutation.
const ref = createNewGoalRef(createNewGoalVars);
// Variables can be defined inline as well.
const ref = createNewGoalRef({ habitId: ..., name: ..., targetValue: ..., targetUnit: ..., startDate: ..., endDate: ..., status: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewGoalRef(dataConnect, createNewGoalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.goal_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.goal_insert);
});
```

## LogHabitEntry
You can execute the `LogHabitEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
logHabitEntry(vars: LogHabitEntryVariables): MutationPromise<LogHabitEntryData, LogHabitEntryVariables>;

interface LogHabitEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogHabitEntryVariables): MutationRef<LogHabitEntryData, LogHabitEntryVariables>;
}
export const logHabitEntryRef: LogHabitEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
logHabitEntry(dc: DataConnect, vars: LogHabitEntryVariables): MutationPromise<LogHabitEntryData, LogHabitEntryVariables>;

interface LogHabitEntryRef {
  ...
  (dc: DataConnect, vars: LogHabitEntryVariables): MutationRef<LogHabitEntryData, LogHabitEntryVariables>;
}
export const logHabitEntryRef: LogHabitEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the logHabitEntryRef:
```typescript
const name = logHabitEntryRef.operationName;
console.log(name);
```

### Variables
The `LogHabitEntry` mutation requires an argument of type `LogHabitEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LogHabitEntryVariables {
  habitId: UUIDString;
  value: number;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `LogHabitEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LogHabitEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LogHabitEntryData {
  habitLog_insert: HabitLog_Key;
}
```
### Using `LogHabitEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, logHabitEntry, LogHabitEntryVariables } from '@dataconnect/generated';

// The `LogHabitEntry` mutation requires an argument of type `LogHabitEntryVariables`:
const logHabitEntryVars: LogHabitEntryVariables = {
  habitId: ..., 
  value: ..., 
  notes: ..., // optional
};

// Call the `logHabitEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await logHabitEntry(logHabitEntryVars);
// Variables can be defined inline as well.
const { data } = await logHabitEntry({ habitId: ..., value: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await logHabitEntry(dataConnect, logHabitEntryVars);

console.log(data.habitLog_insert);

// Or, you can use the `Promise` API.
logHabitEntry(logHabitEntryVars).then((response) => {
  const data = response.data;
  console.log(data.habitLog_insert);
});
```

### Using `LogHabitEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, logHabitEntryRef, LogHabitEntryVariables } from '@dataconnect/generated';

// The `LogHabitEntry` mutation requires an argument of type `LogHabitEntryVariables`:
const logHabitEntryVars: LogHabitEntryVariables = {
  habitId: ..., 
  value: ..., 
  notes: ..., // optional
};

// Call the `logHabitEntryRef()` function to get a reference to the mutation.
const ref = logHabitEntryRef(logHabitEntryVars);
// Variables can be defined inline as well.
const ref = logHabitEntryRef({ habitId: ..., value: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = logHabitEntryRef(dataConnect, logHabitEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.habitLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.habitLog_insert);
});
```

