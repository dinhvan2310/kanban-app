import React, { PropsWithChildren } from "react";

function AuthLayout({ children }: PropsWithChildren) {
    return (
        <main className={`flex min-h-screen flex-col items-center justify-center p-8 bg-[length:256px] lg:bg-[length:512px]`}
            style={{
                backgroundImage: "url('./backgrounds/login1.svg'), url('./backgrounds/login2.svg')",
                backgroundPosition: 'left bottom, right top',
                backgroundRepeat: 'no-repeat no-repeat',
                backgroundAttachment: 'fixed fixed',
            }}
        >
            {children}
        </main>
    )
}

export default AuthLayout;
