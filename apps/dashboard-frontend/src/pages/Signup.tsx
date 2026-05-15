import { useElysiaClient } from "@/providers/Eden";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react"

export function Signup() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const elysiaClient = useElysiaClient()

    const mutation = useMutation({
        mutationFn: async ({ email, password }: {email: string, password: string}) => {
            let response = await elysiaClient.auth["sign-up"].post({email, password})
            return response;
        }
    })

    return <div>
        <input placeholder="Email" type="text" ref={emailRef} />
        <input placeholder="Password" type="password" ref={passwordRef} />

        <button onClick={() => mutation.mutate({
            email: emailRef.current!.value,
            password: passwordRef.current!.value
        })}>Sign up</button>
    </div>
}