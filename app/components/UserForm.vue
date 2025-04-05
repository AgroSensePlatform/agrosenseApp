<template>
  <StackLayout class="form">
    <TextField v-model="userForm.name" hint="Name" autocorrect="false" autocapitalizationType="words" />
    <TextField v-model="userForm.email" hint="Email" keyboardType="email" autocorrect="false" autocapitalizationType="none" />
    <TextField
      v-if="showPassword"
      v-model="userForm.password"
      hint="Password"
      secure="true"
    />
    <Button :text="buttonText" class="btn btn-primary" @tap="handleSubmit" />
    <Label v-if="errorMessage" class="error-message" :text="errorMessage" />
    <Label v-if="successMessage" class="success-message" :text="successMessage" />
  </StackLayout>
</template>

<script>
export default {
  name: "UserForm",
  props: {
    initialData: {
      type: Object,
      default: () => ({ name: "", email: "", password: "" })
    },
    buttonText: {
      type: String,
      default: "Submit"
    },
    showPassword: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      userForm: { ...this.initialData },
      errorMessage: "",
      successMessage: ""
    };
  },
  methods: {
    handleSubmit() {
      // Emit the current form details to the parent
      this.$emit("submit", this.userForm);
    }
  }
};
</script>

<style scoped lang="scss">
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
