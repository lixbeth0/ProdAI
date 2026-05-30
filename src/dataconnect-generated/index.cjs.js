const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'prodai',
  location: 'northamerica-northeast2'
};
exports.connectorConfig = connectorConfig;
const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
exports.dataConnectSettings = dataConnectSettings;

const listAllHabitsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllHabits');
}
listAllHabitsRef.operationName = 'ListAllHabits';
exports.listAllHabitsRef = listAllHabitsRef;

exports.listAllHabits = function listAllHabits(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllHabitsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createNewGoalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewGoal', inputVars);
}
createNewGoalRef.operationName = 'CreateNewGoal';
exports.createNewGoalRef = createNewGoalRef;

exports.createNewGoal = function createNewGoal(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createNewGoalRef(dcInstance, inputVars));
}
;

const getMyGoalsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyGoals');
}
getMyGoalsRef.operationName = 'GetMyGoals';
exports.getMyGoalsRef = getMyGoalsRef;

exports.getMyGoals = function getMyGoals(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMyGoalsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const logHabitEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LogHabitEntry', inputVars);
}
logHabitEntryRef.operationName = 'LogHabitEntry';
exports.logHabitEntryRef = logHabitEntryRef;

exports.logHabitEntry = function logHabitEntry(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(logHabitEntryRef(dcInstance, inputVars));
}
;
