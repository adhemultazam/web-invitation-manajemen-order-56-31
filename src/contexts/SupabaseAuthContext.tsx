// Sign in with email and password
const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    // Update state manually to ensure immediate update
    setSession(data.session);
    setUser(data.user);

    if (data.user) {
      fetchProfile(data.user.id);
    }

    toast.success("Login berhasil");
    return { error: null };
  } catch (error: any) {
    return { error };
  }
};
