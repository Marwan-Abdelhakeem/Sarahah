export const getRobotsContent = () => {
  return `
User-agent: *
Disallow: /message
Disallow: /auth/resetPassword
Allow: /
Allow: /auth/register
Allow: /auth/login
Sitemap: https://sarahah-beta.vercel.app/public/sitemap.xml
    `;
};
