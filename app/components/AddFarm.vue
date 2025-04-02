<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack()"/>
      <Label class="action-bar-title" text="Add Farm"/>
    </ActionBar>

    <GridLayout class="page__content">
      <TextField v-model="farmName" hint="Enter farm name" class="input"/>
      <Button text="Save Farm" class="save-button" @tap="saveFarm"/>
    </GridLayout>
  </Page>
</template>

<script>
  import { AuthService } from "../shared/auth-service";

  const BASE_URL = "http://10.0.2.2:8000"; // Replace with your backend URL

  export default {
    data() {
      return {
        farmName: "", // Store the new farm name
      };
    },
    methods: {
      async saveFarm() {
        try {
          const token = AuthService.getToken();
          if (!token) {
            alert("You must be logged in to add a farm.");
            return;
          }

          const response = await fetch(`${BASE_URL}/api/farms`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: this.farmName }),
          });

          if (response.ok) {
            alert("Farm added successfully!");
            this.$navigateBack(); // Navigate back to the Farms page
          } else {
            console.error("Failed to add farm:", await response.text());
            alert("Failed to add farm. Please try again.");
          }
        } catch (error) {
          console.error("Error adding farm:", error);
          alert("An error occurred while adding the farm.");
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .input {
    margin: 20;
    font-size: 18;
  }

  .save-button {
    margin: 20;
    font-size: 18;
    background-color: #28a745;
    color: white;
    padding: 10;
    border-radius: 5;
    text-align: center;
  }
</style>
