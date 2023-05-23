import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
     //only accept post requests
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    try {
        return res.redirect('/history.tsx')
    } catch (error: any) {
        console.log('error', error);
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
}
