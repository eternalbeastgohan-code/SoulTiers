const { createClient } = require('redis');

const redis = createClient({ 
    url: process.env.KV_REST_API_URL || 'redis://default:tUIbcoIxOjOJKqzdujShrW1ifHNNfnpF@redis-19945.crce185.ap-seast-1-1.ec2.cloud.redislabs.com:19945'
});

let isConnected = false;

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (!isConnected) {
        await redis.connect();
        isConnected = true;
    }

    if (req.method === 'GET') {
        try {
            const data = await redis.get('players');
            return res.json(data ? JSON.parse(data) : []);
        } catch (error) {
            return res.json([]);
        }
    }

    if (req.method === 'POST') {
        try {
            await redis.set('players', JSON.stringify(req.body));
            return res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to save' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
