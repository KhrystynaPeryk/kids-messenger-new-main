// in case the code does not work create a pages/pusher/auth.ts file and mover the commented out below code there and delete this folder and file 
// pages folder is ONLY created because the pusher does not support the new nextjs version
// // for presence channel (pusher) to show active users

// import { NextApiRequest, NextApiResponse } from "next";
// import { auth } from "@/auth";
// import { pusherServer } from "@/lib/pusher";

// export default async function handler(
//     request: NextApiRequest,
//     response: NextApiResponse
// ) {
//     const session = await auth()

//     if (!session?.user?.email) {
//         return response.status(401)
//     }

//     const socketId = request.body.socket_id
//     const channel = request.body.channel_name

//     const data = {
//         user_id: session.user.email
//     }

//     const authResponse = pusherServer.authorizeChannel(socketId, channel, data)

//     return response.send(authResponse)
// }

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { pusherServer } from '@/lib/pusher';

export async function POST(request: NextRequest) {
    // Parse form data instead of JSON
    const formData = await request.formData();
    const socketId = formData.get('socket_id');
    const channel = formData.get('channel_name');

    // Validate that socketId and channel are strings
    if (typeof socketId !== 'string' || typeof channel !== 'string') {
        return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
        );
    }

    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
        );
    }

    const data = {
        user_id: session.user.email,
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

    return NextResponse.json(authResponse);
}