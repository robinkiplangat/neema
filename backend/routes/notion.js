const express = require('express');
const router = express.Router();
const { Client, LogLevel } = require('@notionhq/client');
const axios = require('axios'); 
const User = require('../../models/User'); // Adjust path if needed

// Use environment variables intended for backend
const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID;
const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;
const NOTION_REDIRECT_URI = process.env.NOTION_REDIRECT_URI || 'http://localhost:3000/integrations/notion/callback'; // Or your frontend/backend handler

// Helper function to initialize Notion client for a user using middleware data
const getNotionClient = (req) => {
  if (!req.dbUser) {
      console.error('Middleware error: req.dbUser not found in getNotionClient.');
      throw new Error('User data not available in request.');
  }

  // --- Retrieve Token from req.dbUser --- 
  const accessToken = req.dbUser.integrations?.notion?.accessToken;
  // --- End Token Retrieval --- 

  if (!accessToken) {
    console.warn(`User ${req.dbUser.clerkId} does not have a Notion access token.`);
    return null; // Indicate no client could be created
  }
  return new Client({ 
      auth: accessToken,
      // logLevel: LogLevel.DEBUG, // Uncomment for detailed logs
   });
};

// Middleware to handle Notion API errors
const handleNotionApiError = (err, res, clerkUserId) => {
    console.error(`Notion API Error for user ${clerkUserId}:`, err.code, err.body || err.message);
    let statusCode = 500;
    let message = 'Error communicating with Notion.';

    if (err.code === 'unauthorized' || err.status === 401) {
        statusCode = 401;
        message = 'Notion authentication error. Please reconnect Notion.';
        // Clear the invalid token from the user database
        User.findOneAndUpdate({ clerkId: clerkUserId }, {
             $set: { 'integrations.notion.connected': false },
             $unset: { 
                 'integrations.notion.accessToken': '',
                 'integrations.notion.botId': '',
                 'integrations.notion.workspaceId': '',
                 'integrations.notion.workspaceName': '',
                 'integrations.notion.workspaceIcon': '',
                 'integrations.notion.ownerInfo': ''
              }
            }, { new: true })
            .catch(updateErr => console.error(`Failed to clear invalid Notion token for user ${clerkUserId}:`, updateErr));
    } else if (err.code === 'restricted_resource' || err.status === 403) {
        statusCode = 403;
        message = 'Permission denied for Notion operation. Ensure the integration has access to the requested page/database.';
    } else if (err.code === 'object_not_found' || err.status === 404) {
        statusCode = 404;
        message = 'Notion object (page, database, block) not found.';
    } else if (err.code === 'validation_error' || err.status === 400) {
        statusCode = 400;
        message = 'Invalid request data sent to Notion.';
    }

    res.status(statusCode).json({ message: message, details: err.body || err.message });
};

// === Authentication Routes ===

// POST /integrations/notion/connect - Initiate OAuth flow
router.post('/connect', (req, res) => {
  try {
    if (!req.dbUser) return res.status(401).send('Auth required');
    if (!NOTION_CLIENT_ID || !NOTION_REDIRECT_URI) {
       console.error('Notion OAuth environment variables NOTION_CLIENT_ID or NOTION_REDIRECT_URI are missing.')
       throw new Error('Notion client ID or redirect URI not configured on the server.');
    }
    const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(NOTION_REDIRECT_URI)}`;
    // Add state parameter linking to the user
    // const state = req.dbUser.clerkId; // Using clerkId as state
    // authUrl += `&state=${state}`;
    res.json({ authUrl });
  } catch (error) {
    console.error('Error initiating Notion connection:', error);
    res.status(500).json({ message: 'Failed to initiate Notion connection' });
  }
});

// POST /integrations/notion/callback - Handle OAuth callback
// This endpoint now expects the frontend to send the `code` after user is redirected
// back from Notion. It uses the already authenticated user (`req.dbUser`) from the middleware.
router.post('/callback', async (req, res) => {
  if (!req.dbUser) return res.status(401).send('Auth required');

  const { code } = req.body; // Frontend sends the code
  const clerkId = req.dbUser.clerkId;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code is required' });
  }
  if (!NOTION_CLIENT_ID || !NOTION_CLIENT_SECRET) {
     console.error('Notion OAuth environment variables NOTION_CLIENT_ID or NOTION_CLIENT_SECRET are missing.');
     return res.status(500).json({ message: 'Notion integration configuration error on the server.' });
  }

  try {
    const encoded = Buffer.from(`${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`).toString('base64');
    const response = await axios.post('https://api.notion.com/v1/oauth/token', {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: NOTION_REDIRECT_URI,
    }, {
      headers: {
        'Authorization': `Basic ${encoded}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    const { access_token, bot_id, workspace_id, workspace_name, workspace_icon, owner, duplicated_template_id } = response.data;

    // --- Store Token and Details in DB --- 
    const updateData = {
        'integrations.notion.connected': true,
        'integrations.notion.accessToken': access_token,
        'integrations.notion.botId': bot_id,
        'integrations.notion.workspaceId': workspace_id,
        'integrations.notion.workspaceName': workspace_name,
        'integrations.notion.workspaceIcon': workspace_icon,
        'integrations.notion.ownerInfo': owner // Store the owner object
    };
    
    const updatedUser = await User.findOneAndUpdate(
        { clerkId: clerkId }, 
        { $set: updateData },
        { new: true } 
    );
    if (!updatedUser) {
         console.error(`Failed to find user ${clerkId} to store Notion token.`);
         return res.status(404).json({ message: 'User not found while saving Notion connection.'});
    }
    console.log(`Stored Notion token for user ${clerkId} in workspace: ${workspace_name}`);
    // --- End Store Token --- 

    res.json({ success: true, workspaceName: workspace_name });

  } catch (error) {
    console.error('Error completing Notion OAuth callback:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to exchange Notion code for token', details: error.response?.data || error.message });
  }
});

// GET /integrations/notion/status - Check connection
router.get('/status', async (req, res) => {
  if (!req.dbUser) return res.status(401).send('Auth required');
  
  try {
     const isConnected = req.dbUser.isIntegrationConnected('notion');
     
     // Optional: Verify token validity with a quick API call
     if (isConnected) {
         const notion = getNotionClient(req);
         if (notion) {
             await notion.users.me(); // Simple check
             res.json({ connected: true, workspace: req.dbUser.integrations.notion.workspaceName });
         } else {
             // Should not happen if isConnected is true, but defensively:
             res.json({ connected: false });
         }
     } else {
         res.json({ connected: false });
     }
  } catch (error) {
     // If notion.users.me() fails (e.g., token revoked), treat as disconnected
     if (error.code === 'unauthorized' || error.status === 401) {
         console.log(`Notion token validation failed for user ${req.dbUser.clerkId}.`);
          // Attempt to mark as disconnected in DB
          await User.findOneAndUpdate({ clerkId: req.dbUser.clerkId }, {
               $set: { 'integrations.notion.connected': false },
               $unset: { 'integrations.notion.accessToken': '' }
          }).catch(err => console.error('Failed to mark Notion disconnected after API error:', err));
         res.json({ connected: false });
     } else {
        handleNotionApiError(error, res, req.dbUser.clerkId);
     }
  }
});

// POST /integrations/notion/disconnect
router.post('/disconnect', async (req, res) => {
  if (!req.dbUser) return res.status(401).send('Auth required');
  const clerkId = req.dbUser.clerkId;
  try {
    // --- Delete Token from DB --- 
    await User.findOneAndUpdate({ clerkId: clerkId }, {
        $set: { 'integrations.notion.connected': false },
        $unset: { 
             'integrations.notion.accessToken': '',
             'integrations.notion.botId': '',
             'integrations.notion.workspaceId': '',
             'integrations.notion.workspaceName': '',
             'integrations.notion.workspaceIcon': '',
             'integrations.notion.ownerInfo': ''
        }
    });
    // --- End Delete Token --- 
    
    console.log(`User ${clerkId} disconnected from Notion.`);
    res.json({ success: true });
  } catch (error) {
    console.error(`Error disconnecting Notion for user ${clerkId}:`, error);
    res.status(500).json({ message: 'Failed to disconnect Notion' });
  }
});

// Middleware to ensure Notion client is available for data routes
router.use((req, res, next) => {
    if (['/connect', '/callback', '/status', '/disconnect'].includes(req.path)) {
        return next(); // Skip for auth-related routes
    }
    if (!req.dbUser) {
        // Should be caught by requireAuthAndLoadUser, but as a safeguard
        return res.status(401).json({ message: 'Authentication required.' });
    }
    try {
        req.notion = getNotionClient(req); // Attempt to get client using dbUser token
        if (!req.notion) {
            // No token found or client couldn't initialize
            return res.status(401).json({ message: 'Notion integration is not connected. Please connect Notion in settings.' });
        }
        next();
    } catch (error) {
        // Handle unexpected errors from getNotionClient
        res.status(500).json({ message: error.message || 'Notion client initialization error.' });
    }
});

// === Data Routes (No changes needed below this line, they now use req.notion) ===

// GET /integrations/notion/pages - Fetch pages shared with the integration
router.get('/pages', async (req, res) => {
  try {
    const response = await req.notion.search({
      filter: { property: 'object', value: 'page' },
      sort: { direction: 'descending', timestamp: 'last_edited_time' },
      page_size: parseInt(req.query.pageSize || '50', 10),
    });
    const pages = response.results.map(page => ({
      id: page.id,
      title: page.properties.title?.title?.[0]?.plain_text || 'Untitled',
      url: page.url,
      lastEdited: page.last_edited_time,
      createdTime: page.created_time,
      icon: page.icon?.type === 'emoji' ? page.icon.emoji : (page.icon?.file?.url || page.icon?.external?.url || null),
      parentId: page.parent?.page_id || page.parent?.database_id || (page.parent?.type === 'workspace' ? page.parent.workspace : null),
      parentType: page.parent?.type,
    }));
    res.json(pages);
  } catch (error) {
    handleNotionApiError(error, res, req.dbUser.clerkId);
  }
});

// GET /integrations/notion/databases - Fetch databases shared with the integration
router.get('/databases', async (req, res) => {
  try {
    const response = await req.notion.search({
      filter: { property: 'object', value: 'database' },
      sort: { direction: 'descending', timestamp: 'last_edited_time' },
      page_size: parseInt(req.query.pageSize || '50', 10),
    });
     const databases = response.results.map(db => ({
      id: db.id,
      title: db.title?.[0]?.plain_text || 'Untitled Database',
      url: db.url,
      lastEdited: db.last_edited_time,
      createdTime: db.created_time,
      icon: db.icon?.type === 'emoji' ? db.icon.emoji : (db.icon?.file?.url || db.icon?.external?.url || null),
      parentId: db.parent?.page_id || (db.parent?.type === 'workspace' ? db.parent.workspace : null),
      parentType: db.parent?.type,
    }));
    res.json(databases);
  } catch (error) {
    handleNotionApiError(error, res, req.dbUser.clerkId);
  }
});

// GET /integrations/notion/pages/:pageId/blocks - Fetch blocks (content) of a page
router.get('/pages/:pageId/blocks', async (req, res) => {
  const { pageId } = req.params;
  try {
    const response = await req.notion.blocks.children.list({ 
        block_id: pageId, 
        page_size: 100 
    });
    const blocks = response.results.map(block => ({
        id: block.id,
        type: block.type,
        content: block[block.type], 
        hasChildren: block.has_children,
    }));
    res.json(blocks);
  } catch (error) {
     handleNotionApiError(error, res, req.dbUser.clerkId);
  }
});

// POST /integrations/notion/pages - Create a new Notion page
router.post('/pages', async (req, res) => {
  const { title, content, parentId, parentType = 'page', iconEmoji, iconUrl } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Page title is required' });
  }
  if (!parentId) {
      return res.status(400).json({ message: 'A parent page ID (parentId) is required to create a Notion page via API.' });
  }

  try {
    let parentConfig = {};
    if (parentType === 'page') {
        parentConfig = { page_id: parentId };
    } else {
         console.warn('Creating page directly in database via this endpoint not supported, treating parent as page.');
        parentConfig = { page_id: parentId };
    }

    const pageData = {
      parent: parentConfig,
      properties: {
        title: [{ type: 'text', text: { content: title } }],
      },
      children: content ? content : [],
    };
    if (iconEmoji) {
        pageData.icon = { type: 'emoji', emoji: iconEmoji };
    } else if (iconUrl) {
        pageData.icon = { type: 'external', external: { url: iconUrl } };
    }

    const response = await req.notion.pages.create(pageData);
    const newPage = {
        id: response.id,
        title: response.properties.title?.title?.[0]?.plain_text || 'Untitled',
        url: response.url,
        lastEdited: response.last_edited_time,
        createdTime: response.created_time,
        icon: response.icon?.type === 'emoji' ? response.icon.emoji : (response.icon?.file?.url || response.icon?.external?.url || null),
        parentId: response.parent?.page_id || response.parent?.database_id || (response.parent?.type === 'workspace' ? response.parent.workspace : null),
        parentType: response.parent?.type,
     };
    res.status(201).json(newPage);

  } catch (error) {
    handleNotionApiError(error, res, req.dbUser.clerkId);
  }
});

// GET /integrations/notion/search - Search accessible pages/databases
router.get('/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }
  try {
    const response = await req.notion.search({
      query: query,
      page_size: parseInt(req.query.pageSize || '20', 10),
    });
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
                parentId: item.parent?.page_id || item.parent?.database_id || (item.parent?.type === 'workspace' ? item.parent.workspace : null),
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
                parentId: item.parent?.page_id || (item.parent?.type === 'workspace' ? item.parent.workspace : null),
                parentType: item.parent?.type,
            };
        }
        return null;
    }).filter(Boolean);
    res.json(results);

  } catch (error) {
    handleNotionApiError(error, res, req.dbUser.clerkId);
  }
});

module.exports = router;
