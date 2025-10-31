
import { createContext, useState, useContext, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const AuthContext = createContext()
const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const url = import.meta.env.VITE_SUPABASE_URL;

export const supabase = createClient(url, apikey);

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(null);

    const signUpNewUser = async (email, password, firstName, lastName) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    is_active: true
                }
            }
        })

        if (error) {
            console.error('Error signing up:', error)
            return { success: false, error }
        }

        // The database trigger will automatically create the user record
        return { success: true, data }
    }

    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })

            if (error) {
                console.error('Issue signing in.', error)
                return { success: false, error }
            }

            console.log('sign in success.', data)
            return { success: true }

        }
        catch (error) {
            console.error('Issue signing in.', error)
            return { success: false, error }
        }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error('Issue signing out.', error)
            return { success: false, error }
        }

        return { success: true }

    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    const getUserData = async () => {
        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser();

        if (userError) {
            console.error("Error getting auth user:", userError);
            return { success: false, error: userError };
        }

        if (!user) {
            return { success: false, error: "No authenticated user" };
        }

        const { data, error } = await supabase
            .from("users")
            .select("first_name, last_name, email")
            .eq("user_id", user.id)
            .single();

        if (error) {
            console.error("Issue getting user data.", error);
            return { success: false, error };
        }

        return { success: true, data };
    }





    return (
        <AuthContext.Provider value={{ session, signUpNewUser, signOut, signIn, getUserData }}>
            {children}
        </AuthContext.Provider>
    )



}

export const UserAuth = () => {
    return useContext(AuthContext)
}