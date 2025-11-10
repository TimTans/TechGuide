
import { createContext, useState, useContext, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const AuthContext = createContext()
const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const url = import.meta.env.VITE_SUPABASE_URL;

export const supabase = createClient(url, apikey);

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(null);

    // Added user role for input here.
    const signUpNewUser = async (email, password, firstName, lastName, userRole) => {
        // Check if email already exists using RPC
        const { data: emailExists, error: checkError } = await supabase
            .rpc('check_email_exists', { check_email: email });

        if (checkError) {
            console.error('Error checking email:', checkError);
            // Continue anyway if check fails
        }

        // If email exists, return error
        if (emailExists) {
            return {
                success: false,
                error: { message: 'This email is already registered. Please sign in instead.' }
            };
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    is_active: true,
                    user_role: userRole
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