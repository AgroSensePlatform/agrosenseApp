export const AuthService = {
  token: null, // Store the token here
  setToken(newToken) {
    this.token = newToken;
  },
  getToken() {
    return this.token;
  },
};
