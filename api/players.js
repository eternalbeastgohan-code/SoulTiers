let players = [];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    
    if (req.method === 'GET') {
        return res.json(players);
    }
    
    if (req.method === 'POST') {
        players = req.body;
        return res.json({ success: true });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
}
