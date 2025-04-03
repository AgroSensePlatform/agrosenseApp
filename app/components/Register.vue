<template>
    <Page class="page">
      <ActionBar class="action-bar">
        <NavigationButton visibility="hidden"/>
        <GridLayout columns="50, *">
          <Label class="action-bar-title" text="Register" colSpan="2"/>

          <Label class="fas" text.decode="&#xf0c9;" @tap="onDrawerButtonTap"/>
        </GridLayout>
      </ActionBar>

      <GridLayout class="page__content">
        <StackLayout class="form">
          <TextField v-model="name" hint="Name" autocorrect="false" autocapitalizationType="words" />
          <TextField v-model="email" hint="Email" keyboardType="email" autocorrect="false" autocapitalizationType="none" />
          <TextField v-model="password" hint="Password" secure="true" />
          <Button text="Register" class="btn btn-primary" @tap="registerUser" />
          <Label v-if="errorMessage" class="error-message" :text="errorMessage" />
          <Label v-if="successMessage" class="success-message" :text="successMessage" />
        </StackLayout>
      </GridLayout>
    </Page>
</template>

<script>
  import * as utils from "~/shared/utils";
  import { SelectedPageService } from "../shared/selected-page-service";
  import { BASE_URL } from "../shared/config"; // Import BASE_URL from the shared config
  import Login from "./Login"; // Import the Login component for navigation

  export default {
    mounted() {
      SelectedPageService.getInstance().updateSelectedPage("Register");
    },
    data() {
      return {
        name: "",
        email: "",
        password: "",
        errorMessage: "",
        successMessage: "",
      };
    },
    methods: {
      onDrawerButtonTap() {
        utils.showDrawer();
      },
      async registerUser() {
        try {
          const response = await fetch(`${BASE_URL}/api/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: this.name,
              email: this.email,
              password: this.password,
            }),
          });
          const data = await response.json();
          console.log("Register Response:", data);
          if (response.ok) {
            this.successMessage = "Registration successful! You can now log in.";
            this.errorMessage = "";
            setTimeout(() => {
              this.$navigateTo(Login); // Navigate to the Login page after success
            }, 2000);
          } else {
            this.errorMessage = data.message || "Registration failed. Please try again.";
            this.successMessage = "";
          }
        } catch (error) {
          console.error("Error registering user:", error);
          this.errorMessage = "An error occurred while registering.";
          this.successMessage = "";
        }
      },
    },
  };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '~/styles/variables/green';
    // End custom common variables

    .form {
        margin: 20;
        padding: 20;
    }

    .error-message {
        color: red;
        margin-top: 10;
    }

    .success-message {
        color: green;
        margin-top: 10;
    }
</style>
