import type { APIRoute } from "astro"
import { writeFile } from "fs/promises"

export const post: APIRoute = async ({ request }) => {
  const { body } = request

  if (!body) {
    return new Response("no body", { status: 400 })
  } else {
    const reader = body.getReader()
    const chunks: Uint8Array[] = []

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        chunks.push(value)
      }

      const buffer = Buffer.concat(chunks)
      await writeFile("public/uploaded-file.txt", buffer)

      return new Response("ok")
    } catch (error) {
      return new Response("error", { status: 500 })
    }
  }
}
