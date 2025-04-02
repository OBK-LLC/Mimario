// Email registration
export const registerWithEmail = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
        data: {
          email_verified: true,
        },
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(400).json({ error: "Failed to create user" });
    }

    // Create user profile
    try {
      await createUserProfile(data.user.id, data.user.email || email);
    } catch (profileError) {
      console.error("Error creating user profile:", profileError);
      // We'll still return success since the auth record was created
    }

    return res.status(200).json({
      message: "User registered successfully",
      user: data.user,
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
