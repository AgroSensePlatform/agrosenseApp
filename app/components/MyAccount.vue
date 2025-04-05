<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden"/>
      <GridLayout columns="50, *">
        <Label class="action-bar-title" text="MyAccount" colSpan="2"/>
        <Label class="fas" text.decode="&#xf0c9;" @tap="onDrawerButtonTap"/>
      </GridLayout>
    </ActionBar>

    <GridLayout class="page__content">
      <UserForm
        :initialData="userData"
        :buttonText="'Save Changes'"
        :showPassword="true"
        @submit="updateUser"
      />
    </GridLayout>
  </Page>
</template>

<script>
  import * as utils from "~/shared/utils";
  import { SelectedPageService } from "../shared/selected-page-service";
  import UserForm from "./UserForm";
  import { BASE_URL } from "../shared/config";
  import { AuthService } from "~/shared/auth-service";


  export default {
    components: { UserForm },
    data() {
      return {
        userData: {
          name: "",
          email: "",
          password: "",
        }
      };
    },
    mounted() {
      SelectedPageService.getInstance().updateSelectedPage("MyAccount");
      //  populate current user data
      this.fetchUserData();
    },
    methods: {
      onDrawerButtonTap() {
        utils.showDrawer();
      },
      async updateUser(formData) {
        try {
          // Update user logic, e.g., via a PUT/PATCH API call
          const token = AuthService.getToken();
          const response = await fetch(`${BASE_URL}/api/user`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData)
          });
          if (response.ok) {
            console.log("User updated successfully");
          } else {
            console.error("Update failed:", await response.text());
          }
        } catch (error) {
          console.error("Error updating user:", error);
        }
      },
      async fetchUserData() {
        const token = AuthService.getToken();
        console.log("Fetching user data...");
        if (!token) {
          console.warn("No token found. User is not logged in.");
          this.userData = null;
          return;
        }
        try {
          const response = await fetch(`${BASE_URL}/api/user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            this.userData = {
              name: userData.name,
              email: userData.email,
              password: "", // Password should not be fetched for security reasons
            };
            console.log("User data fetched successfully:", userData);
          } else {
            console.error("Failed to fetch user data:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    },
  };
</script>

<style scoped lang="scss">
  @import '~/styles/variables/green';
</style>
