export const getRobotsContent = () => {
  return `
User-agent: *
Disallow: /message
Disallow: /auth/resetPassword
Allow: /
Allow: /auth/register
Allow: /auth/login
    `;
};
