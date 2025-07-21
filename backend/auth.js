/**
 * 扣子API OAuth认证和刷新机制
 * 用于获取和刷新Access Token，确保API调用的稳定性
 */

const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// 存储Token的文件路径
const TOKEN_FILE_PATH = path.join(__dirname, '.token.json');

// OAuth配置
const OAUTH_CONFIG = {
  client_id: process.env.COZE_CLIENT_ID,
  redirect_uri: process.env.COZE_REDIRECT_URI,
  token_url: 'https://api.coze.cn/api/permission/oauth2/token',
  auth_url: 'https://www.coze.cn/api/permission/oauth2/authorize'
};

/**
 * 生成随机的code_verifier
 * @returns {string} 生成的code_verifier
 */
function generateCodeVerifier() {
  return crypto.randomBytes(32)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .substring(0, 128);
}

/**
 * 根据code_verifier生成code_challenge
 * @param {string} codeVerifier - 用于生成challenge的verifier
 * @returns {string} 生成的code_challenge
 */
function generateCodeChallenge(codeVerifier) {
  const hash = crypto.createHash('sha256')
    .update(codeVerifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return hash;
}

/**
 * 保存Token到文件
 * @param {Object} tokenData - 要保存的Token数据
 * @returns {Promise<void>}
 */
async function saveToken(tokenData) {
  try {
    // 添加过期时间计算
    if (tokenData.expires_in) {
      tokenData.expires_at = Date.now() + tokenData.expires_in * 1000;
    }
    await fs.writeFile(TOKEN_FILE_PATH, JSON.stringify(tokenData, null, 2));
    console.log('Token已保存到文件');
  } catch (error) {
    console.error('保存Token失败:', error);
    throw error;
  }
}

/**
 * 从文件加载Token
 * @returns {Promise<Object|null>} 加载的Token数据，如果文件不存在则返回null
 */
async function loadToken() {
  try {
    const data = await fs.readFile(TOKEN_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Token文件不存在');
      return null;
    }
    console.error('加载Token失败:', error);
    throw error;
  }
}

/**
 * 检查Token是否过期
 * @param {Object} tokenData - Token数据
 * @returns {boolean} 如果Token已过期则返回true，否则返回false
 */
function isTokenExpired(tokenData) {
  if (!tokenData || !tokenData.expires_at) {
    return true;
  }
  // 提前5分钟刷新，避免边界情况
  return Date.now() > tokenData.expires_at - 5 * 60 * 1000;
}

/**
 * 使用refresh_token刷新access_token
 * @param {string} refreshToken - 用于刷新的refresh_token
 * @returns {Promise<Object>} 新的Token数据
 */
async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post(OAUTH_CONFIG.token_url, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: OAUTH_CONFIG.client_id
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const newTokenData = response.data;
    await saveToken(newTokenData);
    console.log('Access Token已刷新');
    return newTokenData;
  } catch (error) {
    console.error('刷新Access Token失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 获取有效的access_token
 * 如果token不存在或已过期，则尝试使用refresh_token刷新
 * @returns {Promise<string>} 有效的access_token
 */
async function getValidAccessToken() {
  try {
    // 尝试从文件加载token
    let tokenData = await loadToken();

    // 如果token不存在或已过期，且有refresh_token，则尝试刷新
    if (isTokenExpired(tokenData) && tokenData?.refresh_token) {
      console.log('Access Token已过期，尝试刷新...');
      tokenData = await refreshAccessToken(tokenData.refresh_token);
    } else if (isTokenExpired(tokenData)) {
      // 如果没有refresh_token或refresh_token也过期了，则抛出错误
      throw new Error('Access Token已过期且无法刷新，请重新授权');
    }

    return tokenData.access_token;
  } catch (error) {
    console.error('获取有效Access Token失败:', error.message);
    throw error;
  }
}

/**
 * 生成授权URL
 * @returns {Object} 包含授权URL和code_verifier的对象
 */
function generateAuthUrl() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  
  const authUrl = `${OAUTH_CONFIG.auth_url}?` +
    `response_type=code&` +
    `client_id=${OAUTH_CONFIG.client_id}&` +
    `redirect_uri=${encodeURIComponent(OAUTH_CONFIG.redirect_uri)}&` +
    `state=random_state&` +
    `code_challenge=${codeChallenge}&` +
    `code_challenge_method=S256`;
  
  return {
    authUrl,
    codeVerifier
  };
}

/**
 * 使用授权码获取access_token和refresh_token
 * @param {string} code - 授权码
 * @param {string} codeVerifier - 生成授权URL时使用的code_verifier
 * @returns {Promise<Object>} Token数据
 */
async function getTokenWithCode(code, codeVerifier) {
  try {
    const response = await axios.post(OAUTH_CONFIG.token_url, {
      grant_type: 'authorization_code',
      code,
      redirect_uri: OAUTH_CONFIG.redirect_uri,
      client_id: OAUTH_CONFIG.client_id,
      code_verifier: codeVerifier
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const tokenData = response.data;
    await saveToken(tokenData);
    console.log('已获取新的Access Token和Refresh Token');
    return tokenData;
  } catch (error) {
    console.error('获取Token失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 使用API Key作为备用认证方式
 * @returns {string} API Key
 */
function getApiKey() {
  return process.env.COZE_API_KEY || process.env.SMC_API_KEY;
}

/**
 * 获取用于API请求的授权头
 * 优先使用OAuth Token，如果获取失败则回退到API Key
 * @returns {Promise<string>} 授权头值
 */
async function getAuthorizationHeader() {
  try {
    // 尝试获取有效的access_token
    const accessToken = await getValidAccessToken();
    return `Bearer ${accessToken}`;
  } catch (error) {
    console.warn('获取OAuth Token失败，回退到API Key:', error.message);
    // 回退到API Key
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('无法获取有效的认证凭据');
    }
    return `Bearer ${apiKey}`;
  }
}

module.exports = {
  generateAuthUrl,
  getTokenWithCode,
  getValidAccessToken,
  getAuthorizationHeader,
  refreshAccessToken,
  isTokenExpired,
  loadToken,
  saveToken
};