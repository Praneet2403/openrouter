import { prisma } from "../../../../../packages/db"

export abstract class AuthService {
    //first request from a Clerk user links them to the account with the same
    //email (created before Clerk) or creates a new one
    static async findOrCreateClerkUser(clerkId : string, getEmail : () => Promise<string | undefined>) : Promise<number> {
        const existing = await prisma.user.findUnique({
            where : { clerkId },
            select : { id : true }
        })
        if(existing) {
            return existing.id
        }

        const email = await getEmail()
        if(!email) {
            throw new Error(`Clerk user ${clerkId} has no email address`)
        }

        const user = await prisma.user.upsert({
            where : { email },
            update : { clerkId },
            create : { email, clerkId },
            select : { id : true }
        })
        return user.id
    }

    static async getUserDetails(id: number ) {
        return prisma.user.findFirst({
            where: {
                id
            },
            select : {
                credits : true
            }
        })
    }
}
