export const login = async (req, res) => {
  const { email, password } = req.body;

  return res.json({
    status: "success",
    message: "Mock login success",
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    user: {
      id: "123",
      email,
      name: "Mock User",
    },
  });
};
