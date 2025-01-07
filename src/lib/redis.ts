import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL!,
    token: process.env.UPSTASH_REDIS_TOKEN!,
})

interface Message {
    sender: string;
    message: string;
    timestamp: number;
}

export async function publishMessage(room: string, message: Message) {
    await redis.publish(room, JSON.stringify(message));
}

export async function storeMessage(room: string, message: Message) {
    await redis.lpush(`chat:${room}`, JSON.stringify(message));
    await redis.ltrim(`chat:${room}`, 0, 99);
}


export async function getMessages(room: string): Promise<Message[]> {
    const messages = await redis.lrange(`chat:${room}`, 0, -1);
    return messages
        .map((msg) => {
            try {
                let parsedMsg = msg;
                return {
                    // @ts-ignore
                    sender: parsedMsg.sender || "Unknown",
                    // @ts-ignore
                    message: parsedMsg.message || "",
                    // @ts-ignore
                    timestamp: parsedMsg.timestamp || Date.now(),
                };
            } catch (error) {
                console.error("Error parsing message:", msg);
                return null;
            }
        })
        .filter((msg): msg is Message => msg !== null);
}

export async function getLatestMessages(room: string, lastTimestamp: number): Promise<Message[]> {
    const messages = await getMessages(room);
    return messages.filter((msg) => msg.timestamp > lastTimestamp);
}
   
export async function setUsername(room: string, userId: string, username: string) {
    await redis.hset(`users:${room}`, { [userId]: username });
}
   
export async function getUsername(room: string, userId: string): Promise<string> {
    const username = await redis.hget(`users:${room}`, userId);
    console.log("Username: ", username )
    // @ts-ignore
    return username || "Anonymous";
}