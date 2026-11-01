import { prisma } from "../../../../../packages/db"

export class MissingEmailError extends Error {}

export abstract class AuthService {
    //first request from a Clerk user links them to the account with the same
    //email (created before Clerk) or creates a new one
    static async findOrCreateClerkUser(clerkId : string, getEmail : () => Promise<string | undefined>) : Promise<number> {
        const existing = await AuthService.findByClerkId(clerkId)
        if(existing) {
            return existing
        }

        const email = await getEmail()
        if(!email) {
            throw new MissingEmailError(`Clerk user ${clerkId} has no email address`)
        }

        try {
            const user = await prisma.user.upsert({
                where : { email },
                update : { clerkId },
                create : { email, clerkId },
                select : { id : true }
            })
            return user.id
        } catch (err) {
            //the dashboard fires several requests at once on first login; when
            //they race to create the same user, the losers read the winner's row
            const winner = await AuthService.findByClerkId(clerkId)
            if(winner) {
                return winner
            }
            throw err
        }
    }

    private static async findByClerkId(clerkId : string) : Promise<number | undefined> {
        const user = await prisma.user.findUnique({
            where : { clerkId },
            select : { id : true }
        })
        return user?.id
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
