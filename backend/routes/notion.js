const express = require('express');
const router = express.Router();
const { Client } = require('@notionhq/client');
const axios = require('axios'); // Needed for OAuth token exchange

// TODO: Ensure these are set in your environment variables
const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID;
const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;
const NOTION_REDIRECT_URI = process.env.NOTION_REDIRECT_URI; // e.g., 'http://localhost:3000/integrations/notion/callback' or your frontend URL that calls the backend callback

// Helper function to initialize Notion client for a user
// Assumes user object with notionAccessToken is attached via auth middleware
const getNotionClient = (req) => {
  // TODO: Replace with actual logic to get user's Notion access token
  const accessToken = req.user?.notionAccessToken;
  if (!accessToken) {
    console.warn('No Notion access token found for user.');
    return null; // Or throw an error
  }
  return new Client({ auth: accessToken });
};

// === Authentication Routes ===

// POST /integrations/notion/connect - Initiate OAuth flow
router.post('/connect', (req, res) => {
  try {
    // const { userId, redirectUrl } = req.body; // Get user ID if needed for state
    if (!NOTION_CLIENT_ID || !NOTION_REDIRECT_URI) {
       throw new Error('Notion client ID or redirect URI not configured.');
    }

    const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(NOTION_REDIRECT_URI)}`;
    // TODO: Optionally add a 'state' parameter for security, associating the request with the userId

    res.json({ authUrl });
  } catch (error) {
    console.error('Error initiating Notion connection:', error);
    res.status(500).json({ message: 'Failed to initiate Notion connection' });
  }
});

// POST /integrations/notion/callback - Handle OAuth callback
router.post('/callback', async (req, res) => {
  const { userId, code } = req.body; // Get code from frontend, userId might come from session/JWT

  if (!code) {
    return res.status(400).json({ message: 'Authorization code is required' });
  }

  if (!NOTION_CLIENT_ID || !NOTION_CLIENT_SECRET || !NOTION_REDIRECT_URI) {
     console.error('Notion OAuth environment variables not configured.');
     return res.status(500).json({ message: 'Notion integration configuration error.' });
  }

  try {
    // Encode client ID and secret for Basic Auth
    const encoded = Buffer.from(`${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`).toString('base64');

    // Exchange code for access token
    const response = await axios.post('https://api.notion.com/v1/oauth/token', {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: NOTION_REDIRECT_URI,
    }, {
      headers: {
        'Authorization': `Basic ${encoded}`,
        'Content-Type': 'application/json',
      },
    });

    const accessToken = response.data.access_token;
    const botId = response.data.bot_id;
    const workspaceId = response.data.workspace_id;
    const workspaceName = response.data.workspace_name;
    // const owner = response.data.owner; // User info
    // const duplicatedTemplateId = response.data.duplicated_template_id; // If a template was duplicated

    // TODO: IMPORTANT: Securely store the accessToken associated with the userId in your database.
    // Example: await UserModel.findByIdAndUpdate(userId, { notionAccessToken: accessToken, notionWorkspaceId: workspaceId, ... });
    console.log(`User ${userId} connected to Notion workspace: ${workspaceName}`);

    res.json({ success: true });

  } catch (error) {
    console.error('Error completing Notion OAuth callback:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to get Notion access token' });
  }
});

// GET /integrations/notion/status - Check connection
router.get('/status', async (req, res) => {
  // TODO: Implement logic based on stored token
  // Example: const user = await UserModel.findById(req.query.userId);
  // res.json({ connected: !!user?.notionAccessToken });
  const notion = getNotionClient(req);
  res.json({ connected: !!notion }); // Basic check if client could be initialized
});

// POST /integrations/notion/disconnect
router.post('/disconnect', async (req, res) => {
  const { userId } = req.body;
  try {
    // TODO: Clear the stored Notion access token for the user in your database
    // Example: await UserModel.findByIdAndUpdate(userId, { $unset: { notionAccessToken: "", notionWorkspaceId: "" } });
    console.log(`User ${userId} disconnected from Notion.`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting Notion:', error);
    res.status(500).json({ message: 'Failed to disconnect Notion' });
  }
});

// === Data Routes ===
// Apply middleware to check for Notion client after auth routes
router.use((req, res, next) => {
    req.notion = getNotionClient(req);
    if (!req.notion && !(req.path.startsWith('/connect') || req.path.startsWith('/callback'))) {
        // Allow auth routes even without a token
        return res.status(401).json({ message: 'Notion integration not connected or token missing.'});
    }
    next();
});

// GET /integrations/notion/pages - Fetch pages (requires search capability)
router.get('/pages', async (req, res) => {
  try {
    // Notion API requires using search for this, filtering by object type 'page'
    const response = await req.notion.search({
      filter: { property: 'object', value: 'page' },
      sort: { direction: 'descending', timestamp: 'last_edited_time' },
      page_size: 50, // Adjust as needed
    });
    // Map response to NotionPage interface from frontend service
    const pages = response.results.map(page => ({
      id: page.id,
      title: page.properties.title?.title?.[0]?.plain_text || 'Untitled',
      url: page.url,
      lastEdited: page.last_edited_time,
      createdTime: page.created_time,
      icon: page.icon?.type === 'emoji' ? page.icon.emoji : (page.icon?.file?.url || page.icon?.external?.url || null),
      parentId: page.parent?.page_id || page.parent?.database_id || page.parent?.workspace,
      parentType: page.parent?.type,
    }));
    res.json(pages);
  } catch (error) {
    console.error('Error fetching Notion pages:', error);
    res.status(500).json({ message: 'Error fetching Notion pages' });
  }
});

// GET /integrations/notion/databases - Fetch databases
router.get('/databases', async (req, res) => {
  try {
    const response = await req.notion.search({
      filter: { property: 'object', value: 'database' },
      sort: { direction: 'descending', timestamp: 'last_edited_time' },
      page_size: 50, // Adjust as needed
    });
     // Map response to NotionDatabase interface
     const databases = response.results.map(db => ({
      id: db.id,
      title: db.title?.[0]?.plain_text || 'Untitled Database',
      url: db.url,
      lastEdited: db.last_edited_time,
      createdTime: db.created_time,
      icon: db.icon?.type === 'emoji' ? db.icon.emoji : (db.icon?.file?.url || db.icon?.external?.url || null),
      parentId: db.parent?.page_id || db.parent?.workspace,
      parentType: db.parent?.type,
    }));
    res.json(databases);
  } catch (error) {
    console.error('Error fetching Notion databases:', error);
    res.status(500).json({ message: 'Error fetching Notion databases' });
  }
});

// GET /integrations/notion/pages/:pageId/blocks - Fetch page content
router.get('/pages/:pageId/blocks', async (req, res) => {
  const { pageId } = req.params;
  try {
    const response = await req.notion.blocks.children.list({ block_id: pageId, page_size: 100 /* Max 100, implement pagination if needed */ });
    // Map response to NotionBlock interface
    const blocks = response.results.map(block => ({
        id: block.id,
        type: block.type,
        content: block[block.type], // The content specific to the block type
        hasChildren: block.has_children,
    }));
    res.json(blocks);
  } catch (error) {
    console.error(`Error fetching blocks for Notion page ${pageId}:`, error);
    res.status(500).json({ message: 'Error fetching Notion page content' });
  }
});

// POST /integrations/notion/pages - Create a new Notion page
router.post('/pages', async (req, res) => {
  const { title, content, parentId, parentType = 'page' } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Page title is required' });
  }

  try {
    let parentConfig = {};
    if (parentId) {
        if (parentType === 'page') {
            parentConfig = { page_id: parentId };
        } else if (parentType === 'database') {
            parentConfig = { database_id: parentId };
            // NOTE: Creating pages in databases requires matching property schema
            // This basic example won't work directly for databases without property mapping
             return res.status(500).json({ message: 'Creating pages in databases requires specific property mapping (not implemented in this basic example).' });
        }
    } else {
        // TODO: Need a valid page_id or database_id to create a page under.
        // Cannot create pages directly under the workspace root via API usually.
        // You might need to query for a default page or allow user selection.
        return res.status(400).json({ message: 'Parent ID (page or database) is required to create a Notion page via API.' });
    }

    // Basic structure: title property + optional content blocks
    const pageData = {
      parent: parentConfig,
      // Icon can be added here if needed: icon: { type: 'emoji', emoji: '📄' },
      properties: {
        title: [{
          type: 'text',
          text: { content: title },
        }],
        // Add other properties here if creating in a database
      },
      // Optional: Add initial content blocks
      children: content ? content : [], // Expects content in Notion block format
    };

    const response = await req.notion.pages.create(pageData);

     // Map response to NotionPage interface
     const newPage = {
        id: response.id,
        title: response.properties.title?.title?.[0]?.plain_text || 'Untitled',
        url: response.url,
        lastEdited: response.last_edited_time,
        createdTime: response.created_time,
        icon: response.icon?.type === 'emoji' ? response.icon.emoji : (response.icon?.file?.url || response.icon?.external?.url || null),
        parentId: response.parent?.page_id || response.parent?.database_id || response.parent?.workspace,
        parentType: response.parent?.type,
     };

    res.status(201).json(newPage);
  } catch (error) {
    console.error('Error creating Notion page:', error);
    res.status(500).json({ message: 'Error creating Notion page' });
  }
});

// GET /integrations/notion/search - Search Notion
router.get('/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }
  try {
    const response = await req.notion.search({
      query: query,
      page_size: 20, // Adjust as needed
    });
    // Map results (can be pages or databases)
    const results = response.results.map(item => {
        if (item.object === 'page') {
             return {
                object: 'page',
                id: item.id,
                title: item.properties.title?.title?.[0]?.plain_text || 'Untitled',
                url: item.url,
                lastEdited: item.last_edited_time,
                createdTime: item.created_time,
                icon: item.icon?.type === 'emoji' ? item.icon.emoji : (item.icon?.file?.url || item.icon?.external?.url || null),
                parentId: item.parent?.page_id || item.parent?.database_id || item.parent?.workspace,
                parentType: item.parent?.type,
            };
        } else if (item.object === 'database') {
            return {
                object: 'database',
                id: item.id,
                title: item.title?.[0]?.plain_text || 'Untitled Database',
                url: item.url,
                lastEdited: item.last_edited_time,
                createdTime: item.created_time,
                icon: item.icon?.type === 'emoji' ? item.icon.emoji : (item.icon?.file?.url || item.icon?.external?.url || null),
                parentId: item.parent?.page_id || item.parent?.workspace,
                parentType: item.parent?.type,
            };
        }
        return null; // Should not happen based on API docs
    }).filter(Boolean); // Filter out any nulls

    res.json(results);
  } catch (error) {
    console.error('Error searching Notion:', error);
    res.status(500).json({ message: 'Error searching Notion' });
  }
});

module.exports = router;
