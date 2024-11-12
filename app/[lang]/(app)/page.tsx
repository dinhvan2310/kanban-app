import { decodeTokenAction } from "@/app/actions/auth";

export default async function HomePage() {
    const { decodedToken } = await decodeTokenAction();
    return (
        <div>
            <h1>Home</h1>
            <p>Decoded token: {decodedToken.email}</p>
        </div>
    )
}
