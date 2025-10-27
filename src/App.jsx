// src/App.jsx
import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
//import outputs from "../amplify_outputs.json";

/**
 *  @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */
//Amplify.configure(outputs);

const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [userprofiles, setUserProfiles] = useState([]);
  const { signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    try {
      if (client?.models?.UserProfile?.list) {
        const { data } = await client.models.UserProfile.list();
        setUserProfiles(data ?? []);
      } else if (client?.queries?.userprofiles) {
        const { data } = await client.queries.userprofiles();
        setUserProfiles(data ?? []);
      } else {
        setUserProfiles([]);
      }
    } catch (err) {
      console.error("fetchUserProfile error:", err);
      setUserProfiles([]);
    }
  }

  return (
    <View padding="1rem">
      <Heading level={2}>User Profiles</Heading>

      <Divider marginTop="1rem" marginBottom="1rem" />

      {}
      <Grid
        columnGap="1rem"
        rowGap="0.75rem"
        templateColumns="1fr"
        className="card"
      >
        {userprofiles.length > 0 ? (
          userprofiles.map((p, idx) => (
            <View key={p?.id ?? idx} className="box">
              <strong>{p?.name ?? "Unnamed"}</strong>
              {p?.email ? <div>{p.email}</div> : null}
            </View>
          ))
        ) : (
          <View className="read-the-docs">
            No user profiles yet. (Connect Data to see results)
          </View>
        )}
      </Grid>

      <Flex gap="0.75rem" marginTop="1rem">
        <Button onClick={fetchUserProfile}>Refresh</Button>
        <Button onClick={signOut}>Sign out</Button>
      </Flex>
    </View>
  );
}
