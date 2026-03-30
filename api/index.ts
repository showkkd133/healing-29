import { handle } from 'hono/vercel'
import { app } from '../server/src/index'

export const config = {
  runtime: 'edge' // Using Edge for faster performance
}

export default handle(app)
