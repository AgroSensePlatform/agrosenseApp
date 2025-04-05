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
      <UserForm
        :buttonText="'Register'"
        @submit="registerUser"
      />
    </GridLayout>
  </Page>
</template>

<script>
  import * as utils from "~/shared/utils";
  import { SelectedPageService } from "../shared/selected-page-service";
  import { BASE_URL } from "../shared/config";
  import Login from "./Login";
  import UserForm from "./UserForm";

  export default {
    components: {
      UserForm
    },
    mounted() {
      SelectedPageService.getInstance().updateSelectedPage("Register");
    },
    methods: {
      onDrawerButtonTap() {
        utils.showDrawer();
      },
      async registerUser(formData) {
        try {
          const response = await fetch(`${BASE_URL}/api/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const data = await response.json();
          console.log("Register Response:", data);
          if (response.ok) {
            // Optional: set a success message via the UserForm emit if needed
            setTimeout(() => {
              this.$navigateTo(Login);
            }, 2000);
          } else {
            console.error("Registration failed:", data.message);
          }
        } catch (error) {
          console.error("Error registering user:", error);
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  @import '~/styles/variables/green';
</style>
