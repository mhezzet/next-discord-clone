import { db } from '@/lib/db'
import { conversations } from '@/lib/db/schema'

export const findConversation = async (memberOne: string, memberTwo: string) => {
  return db.query.conversations.findFirst({
    where: (conversations, { eq, and, or }) =>
      or(
        and(eq(conversations.memberOneId, memberOne), eq(conversations.memberTwoId, memberTwo)),
        and(eq(conversations.memberOneId, memberTwo), eq(conversations.memberTwoId, memberOne)),
      ),
    with: {
      memberOne: {
        with: {
          profile: true,
        },
      },
      memberTwo: {
        with: {
          profile: true,
        },
      },
    },
  })
}

export const createNewConversation = async (memberOne: string, memberTwo: string) => {
  await db.insert(conversations).values({ memberOneId: memberOne, memberTwoId: memberTwo })

  return findConversation(memberOne, memberTwo)
}

export const getOrCreateConversation = async (memberOne: string, memberTwo: string) => {
  let conversation = await findConversation(memberOne, memberTwo)

  if (conversation) return conversation

  conversation = await createNewConversation(memberOne, memberTwo)

  return conversation
}
