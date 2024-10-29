import { decodeTokenAction } from "../actions/auth";

export default async function Home() {
    const { decodedToken } = await decodeTokenAction();

    // control state

    return (
        <div>
            <h1>Home</h1>
            <p>Decoded token: {decodedToken.email}</p>
        </div>
    )
}
