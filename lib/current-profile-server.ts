import { db } from '@/lib/db'
import { getAuth } from '@clerk/nextjs/server'
import { NextApiRequest } from 'next'

export const currentProfileServer = async (req: NextApiRequest) => {
  const { userId } = await getAuth(req)

  if (!userId) return null

  const profile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.userId, userId),
  })

  return profile
}
