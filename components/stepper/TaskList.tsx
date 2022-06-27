import React, { useEffect, useState } from "react";
import {
  useTheme,
  Button,
  Dialog,
  IconButton,
  List,
  TextInput,
} from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../../api/api";
import { Task } from "../../model/Task";
import { useMainData } from "../../provider/MainDataProvider";
import { Text, View } from "../Themed";
import Toast from "react-native-toast-message";
import { InterestPoint } from "../../model/InterestPoint";
import { Trip } from "../../model/Trip";
import { Step } from "../../model/Step";
import { TaskListTag } from "../../model/TaskListTags";
import { Element } from "../../model/Element";

export const TaskList = ({ elementId, currentScroll }: any) => {
  //const [isTaskExpanded, setIsTaskExpanded] = useState(true);
  const { currentTravel } = useMainData();

  const [newTaskName, setNewTaskName] = useState("");
  const [selectedTask, setSelectedTask] = useState<number>(-1);
  const [isTaskMenuVisible, setIsTaskMenuVisible] = useState(false);
  const [currentElement, setCurrentElement] = useState<Element>();
  const [currentTag, setCurrentTag] = useState<TaskListTag>();

  const queryClient = useQueryClient();

  // Queries
  const {
    isLoading: tasksIsLoading,
    isError: tasksIsError,
    error: tasksError,
    data: tasks,
  } = useQuery<Task[], Error>(["todos", currentTravel?.id], () =>
    api.get({ route: Task.routeName, idTravel: currentTravel?.id })
  );
  const { data: tags } = useQuery<TaskListTag[], Error>(
    ["tags", currentTravel?.id],
    () =>
      api.get({ route: TaskListTag.routeName, idTravel: currentTravel?.id }),
    { structuralSharing: false }
  );

  const { data: interestPoints } = useQuery<InterestPoint[], Error>(
    ["interestPoints", currentTravel?.id],
    () =>
      api.get({ route: InterestPoint.routeName, idTravel: currentTravel?.id })
  );
  const { data: steps } = useQuery<Step[], Error>(
    ["steps", currentTravel?.id],
    () => api.get({ route: Step.routeName, idTravel: currentTravel?.id })
  );
  const { data: trips } = useQuery<Trip[], Error>(
    ["trips", currentTravel?.id],
    () => api.get({ route: Trip.routeName, idTravel: currentTravel?.id })
  );

  // Mutations
  const createTodo = useMutation(api.create, {
    onSuccess: (todo) => {
      queryClient.setQueryData<Task[]>(["todos", currentTravel?.id], (todos) =>
        todos ? [...todos, todo] : []
      );
      Toast.show({
        type: "success",
        text1: "🎉 Tâche ajoutée avec succès !",
      });
    },
  });
  const updateTodo = useMutation(api.update, {
    onSuccess: (todo, { id, body }) => {
      queryClient.setQueryData<Task[]>(["todos", currentTravel?.id], (todos) =>
        todos!.map((t) =>
          t.id === id
            ? { ...todo, TaskListTags: currentTag ? [currentTag] : [] }
            : t
        )
      );
    },
  });
  const deleteTodo = useMutation(api.delete, {
    onSuccess: (todo, { id }) => {
      queryClient.setQueryData<Task[]>(["todos", currentTravel?.id], (todos) =>
        todos!.filter((t) => t.id !== id)
      );
      setIsTaskMenuVisible(false);
    },
  });

  // Find current element
  useEffect(() => {
    elementId &&
      interestPoints?.forEach(
        (elem) =>
          elem?.element?.id === elementId && setCurrentElement(elem.element)
      );
  }, [interestPoints]);
  useEffect(() => {
    elementId &&
      steps?.forEach(
        (elem) =>
          elem?.element?.id === elementId && setCurrentElement(elem.element)
      );
  }, [steps]);
  useEffect(() => {
    elementId &&
      trips?.forEach(
        (elem) =>
          elem?.element?.id === elementId && setCurrentElement(elem.element)
      );
  }, [trips]);
  useEffect(() => {
    currentElement &&
      tags?.forEach(
        (tag) => tag.name === currentElement.name && setCurrentTag(tag)
      );
  }, [currentElement]);

  const taskList = tasks?.filter((task) => {
    return currentTag
      ? task?.TaskListTags?.filter((tag) => tag?.id === currentTag?.id).length >
          0
      : true;
  });

  const toggleComplete = (selectedTodo: Task) => {
    Object.assign(selectedTodo, { is_terminated: !selectedTodo.is_terminated });

    updateTodo.mutate({
      route: Task.routeName,
      id: selectedTodo?.id!,
      body: selectedTodo,
      idTravel: currentTravel?.id,
    });
  };

  const submitTask = () => {
    createTodo.mutate({
      route: Task.routeName,
      body: new Task({
        name: newTaskName,
        execution_date: null,
        is_terminated: false,
        TaskListTags: currentTag ? [currentTag] : [],
      }),
      idTravel: currentTravel?.id,
    });
    setNewTaskName("");
  };

  const showTaskMenu = (index: number) => {
    setSelectedTask(index);
    setIsTaskMenuVisible(true);
  };
  const { colors } = useTheme();

  return (
    <>
      <View style={{ zIndex: -1 }}>
        <List.Accordion
          title="Tâches"
          theme={{ colors: { primary: colors.grayLightest } }}
          style={{ backgroundColor: colors.grayLighty }}
          left={(props) => <List.Icon {...props} icon="format-list-checks" />}
        >
          {taskList && taskList.length > 0 ? (
            <>
              {taskList.map((task, idx) => (
                <List.Item
                  key={idx}
                  title=""
                  style={{ backgroundColor: colors.grayLighter }}
                  left={() => (
                    <Text
                      style={{
                        textAlignVertical: "center",
                        textDecorationLine: task.is_terminated
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {task?.name}
                    </Text>
                  )}
                  right={() => (
                    <IconButton
                      icon={
                        task.is_terminated
                          ? "checkbox-marked-circle-outline"
                          : "checkbox-blank-circle-outline"
                      }
                    />
                  )}
                  onPress={() => toggleComplete(task)}
                  onLongPress={() => showTaskMenu(idx)}
                />
              ))}
            </>
          ) : (
            <List.Item
              style={{
                backgroundColor: colors.grayLightest,
                borderBottomWidth: 1,
                borderColor: colors.grayLighter,
              }}
              title={"Aucune tâche pour le moment"}
            />
          )}
          <List.Item
            title=""
            left={() => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <TextInput
                  autoComplete
                  placeholder="Nouvelle tâche"
                  value={newTaskName}
                  onChangeText={(text) => setNewTaskName(text)}
                  style={{ display: "flex", flexShrink: 1, flexGrow: 1 }}
                />
                <IconButton icon="check-bold" onPress={submitTask}></IconButton>
              </View>
            )}
          />
        </List.Accordion>
      </View>
      {/* Dialog */}
      <Dialog
        visible={isTaskMenuVisible}
        onDismiss={() => setIsTaskMenuVisible(false)}
        style={{
          position: "absolute",
          top: currentScroll + 100,
          width: "80%",
          alignSelf: "center",
        }}
      >
        <Dialog.Title>Actions</Dialog.Title>
        <Dialog.Content>
          <Button
            mode="outlined"
            style={{ marginVertical: 5 }}
            onPress={() => {
              if (tasks && selectedTask >= 0) {
                const taskId = tasks[selectedTask].id;
                if (taskId)
                  deleteTodo.mutate({
                    route: Task.routeName,
                    id: taskId,
                    idTravel: currentTravel?.id,
                  });
              }
            }}
          >
            Supprimer
          </Button>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setIsTaskMenuVisible(false)}>Annuler</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
};
// <List.Item key={idx} title={task.name} />
//  <List.Item key={idx} title={"Aucune tâche pour le moment"} />
