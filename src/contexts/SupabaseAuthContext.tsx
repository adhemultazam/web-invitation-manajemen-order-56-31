const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    console.log('Supabase SignIn Data:', data);
    console.log('Supabase SignIn Error:', error);

    if (error) {
      return { error };
    }

    setSession(data.session);
    setUser(data.user);

    if (data.user) {
      fetchProfile(data.user.id);
    }

    toast.success("Login berhasil");
    return { error: null };
  } catch (error: any) {
    console.error('SignIn Exception:', error);
    return { error };
  }
};
