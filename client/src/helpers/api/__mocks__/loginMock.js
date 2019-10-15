export default {
  request: ({ url }) => url.match(/users\/login/),
  response: ({ data }) => {
    const isAuthenticated =
      data.username === "john" && data.password === "john12345";
    if (isAuthenticated) {
      return { data: { username: "john", email: "john@email.com" } };
    } else {
      return {
        status: 403,
        data: { error: { message: "Username and/or password is invalid" } }
      };
    }
  }
};
