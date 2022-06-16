const { createWriteStream } = require("fs");
const { SitemapStream } = require("sitemap");

const links = [{ url: "/", changefreq: "daily", priority: 1 }];
const sitemap = new SitemapStream({ hostname: "https://sinsky.dev" });

const writeStream = createWriteStream("./docs/sitemap.xml");
sitemap.pipe(writeStream);
links.map((link) => sitemap.write(link));
sitemap.end();
