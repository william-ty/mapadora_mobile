import React, { useState } from "react";
import {
  useTheme,
  Button,
  Dialog,
  IconButton,
  List,
  TextInput,
  Subheading,
} from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../../api/api";
import { Document as DocumentModel } from "../../model/Document";
import * as DocumentPicker from "expo-document-picker";
import { GestureResponderEvent, Linking, Pressable, View } from "react-native";
import { document_url_prefix } from "../../api/util";
import { useMainData } from "../../provider/MainDataProvider";

export const DocumentList = ({ currentScroll, elementId }: any) => {
  const { currentTravel } = useMainData();
  const { colors } = useTheme();

  const [selectedDocument, setSelectedDocument] = useState<number>(-1);
  const [isDocumentMenuVisible, setIsDocumentMenuVisible] = useState(false);
  const [isInNameEdition, setIsInNameEdition] = useState(false);
  const [newName, setNewName] = useState("");

  // Access the client
  const queryClient = useQueryClient();

  //Queries
  const documentQuery = useQuery<DocumentModel[], Error>(
    ["documents", currentTravel?.id],
    () =>
      api.get({ route: DocumentModel.routeName, idTravel: currentTravel?.id })
  );
  const documentList = Array.isArray(documentQuery.data) //TODO: DELETE THIS VERIFICATIONS? API MUST BE RETURNED [] WHEN NO OBJECT
    ? documentQuery.data?.filter((doc) =>
        elementId ? doc.id_element === elementId : true
      )
    : [];

  // Mutations
  const createDocument = useMutation(api.createWithFormData, {
    onSuccess: (document) => {
      resetStates(); // Reset all state from view
      queryClient.setQueryData<Document[]>(
        ["documents", currentTravel?.id],
        (documents) => (documents ? [...documents, document] : [document])
      );
    },
  });
  const removeDocument = useMutation(api.delete, {
    onSuccess: (document, { id }) => {
      resetStates(); // Reset all state from view
      queryClient.setQueryData<DocumentModel[]>(
        ["documents", currentTravel?.id],
        (documents) => documents!.filter((d) => d.id !== id)
      );
    },
  });
  const updateDocument = useMutation(api.update, {
    onSuccess: (document, { id }) => {
      resetStates(); // Reset all state from view
      queryClient.setQueryData<DocumentModel[]>(
        ["documents", currentTravel?.id],
        (documents) => documents!.map((d) => (d.id === id ? document : d))
      );
    },
  });

  // This function is triggered when the "Select an document" button pressed
  const showDocumentPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync();

    if (result.type !== "cancel") {
      const name = result.uri.split("/").pop();

      // TODO: Modifier le any (faire un type document)
      const document: any = {
        name: name,
        type: `${result.mimeType}`,
        uri: result.uri,
      };

      // Formdata
      const formData = new FormData();
      formData.append("document", document);
      elementId && formData.append("id_element", elementId);

      createDocument.mutate({
        route: DocumentModel.routeName,
        formData: formData,
        hasToken: true,
        idTravel: currentTravel?.id,
      });
    }
  };

  const showDocumentMenu = (index: number) => {
    setSelectedDocument(index);
    setIsDocumentMenuVisible(true);
    setIsInNameEdition(false);
  };

  const editDocumentName = () => {
    setIsDocumentMenuVisible(false);
    setIsInNameEdition(true);
  };

  const updateDocumentName = (document: DocumentModel) => {
    // Update document
    let updatedDocument = document;
    updatedDocument.name = newName;

    if (document.id)
      updateDocument.mutate({
        route: DocumentModel.routeName,
        id: document.id,
        body: updatedDocument,
        idTravel: currentTravel?.id,
      });
    else alert("ID Non renseigné");
  };

  const resetStates = () => {
    setSelectedDocument(-1);
    setIsDocumentMenuVisible(false);
    setIsInNameEdition(false);
    setNewName("");
  };

  return (
    <>
      <View style={{ zIndex: -1 }}>
        <List.Accordion
          title="Documents"
          left={(props) => (
            <List.Icon {...props} icon="file-multiple-outline" />
          )}
          theme={{ colors: { primary: colors.grayDarky } }}
        >
          {documentList && documentList.length > 0 ? (
            documentList.map((doc, idx) => (
              <View
                style={{
                  backgroundColor: colors.grayLightest,
                }}
                key={idx}
              >
                {isInNameEdition && idx === selectedDocument ? (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: colors.grayLighter,
                      borderBottomWidth: 1,
                      borderColor: colors.grayLight,
                    }}
                  >
                    <TextInput
                      autoComplete
                      defaultValue={doc?.name}
                      onChangeText={(text) => setNewName(text)}
                      style={{ display: "flex", flexShrink: 1, flexGrow: 1 }}
                    />
                    <IconButton
                      icon="check-bold"
                      onPress={() => updateDocumentName(doc)}
                    ></IconButton>
                  </View>
                ) : (
                  <List.Item
                    style={{
                      borderColor: colors.grayLight,
                      borderLeftWidth: 1,
                      borderBottomWidth: 1,
                      backgroundColor: colors.grayLightest,
                    }}
                    title={doc?.name}
                    right={(props) => (
                      <Pressable onPress={() => showDocumentMenu(idx)}>
                        <List.Icon {...props} icon="dots-vertical" />
                      </Pressable>
                    )}
                    onPress={() => {
                      Linking.openURL(document_url_prefix + "/" + doc?.path);
                    }}
                    onLongPress={() => showDocumentMenu(idx)}
                  />
                )}
              </View>
            ))
          ) : (
            <List.Item
              style={{ backgroundColor: colors.grayLighter }}
              title={"Aucun document pour le moment"}
            />
          )}
          <List.Item
            style={{ backgroundColor: colors.grayDarky }}
            theme={{ colors: { text: colors.grayLighter } }}
            title={"Importer un document"}
            onPress={showDocumentPicker}
          />
        </List.Accordion>
      </View>

      {/* Dialog */}
      <Dialog
        visible={isDocumentMenuVisible}
        onDismiss={() => setIsDocumentMenuVisible(false)}
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
              editDocumentName();
            }}
          >
            Renommer
          </Button>
          <Button
            mode="outlined"
            style={{ marginVertical: 5 }}
            onPress={() => {
              if (documentQuery.data && selectedDocument >= 0) {
                const documentId = documentQuery.data[selectedDocument].id;
                if (documentId)
                  removeDocument.mutate({
                    route: DocumentModel.routeName,
                    id: documentId,
                    idTravel: currentTravel?.id,
                  });
              }
            }}
          >
            Supprimer
          </Button>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setIsDocumentMenuVisible(false)}>
            Annuler
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
};
