<template>
    <Page class="page">
      <ActionBar class="action-bar">
        <NavigationButton visibility="hidden"/>
        <GridLayout columns="50, *">
          <Label class="action-bar-title" text="Login" colSpan="2"/>

          <Label class="fas" text.decode="&#xf0c9;" @tap="onDrawerButtonTap"/>
        </GridLayout>
      </ActionBar>

      <GridLayout class="page__content">
        <StackLayout class="form">
          <TextField v-model="email" hint="Email" keyboardType="email" autocorrect="false" autocapitalizationType="none" />
          <TextField v-model="password" hint="Password" secure="true" />
          <Button text="Login" class="btn btn-primary" @tap="loginUser" />
          <Label v-if="errorMessage" class="error-message" :text="errorMessage" />
        </StackLayout>
      </GridLayout>
    </Page>
</template>

<script>
  import * as utils from "~/shared/utils";
  import { SelectedPageService } from "../shared/selected-page-service";
  import { AuthService } from "../shared/auth-service"; // Import the AuthService
  import Home from "./Home"; // Import the Home component
  import { BASE_URL } from "../shared/config"; // Import BASE_URL from the shared config



  export default {
    mounted() {
      SelectedPageService.getInstance().updateSelectedPage("Login");
    },
    data() {
      return {
        email: "",
        password: "",
        errorMessage: "",
      };
    },
    methods: {
      onDrawerButtonTap() {
        utils.showDrawer();
      },
      async loginUser() {
        try {
          const response = await fetch(`${BASE_URL}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password,
            }),
          });
          const data = await response.json();
          console.log("Login Response:", data);
          if (data.token) {
            AuthService.setToken(data.token); // Save the token in the shared service
            this.$emit("user-logged-in"); // Emit an event to notify other components
            alert("Login successful!");
            this.$navigateTo(Home); // Navigate to the Home page
          } else {
            this.errorMessage = "Login failed. Please check your credentials.";
          }
        } catch (error) {
          console.error("Error logging in:", error);
          this.errorMessage = "An error occurred while logging in.";
        }
      },
    },
  };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '@nativescript/theme/scss/variables/blue';
    // End custom common variables

    .form {
        margin: 20;
        padding: 20;
    }

    .error-message {
        color: red;
        margin-top: 10;
    }
</style>
