'use server'

export async function createServer(
  formState: { message: string },
  payload: any,
) {
  return { message: 'hello from server' }
}
